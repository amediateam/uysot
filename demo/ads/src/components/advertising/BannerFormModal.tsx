import { zodResolver } from "@hookform/resolvers/zod";
import { Button, message, Segmented, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { ImageUploadField, SelectField, SwitchField, TextField } from "@/components/ui/form-fields";
import { useAds } from "@/store/ads";
import { useBanner, useLanguages, useSaveBanner } from "@/services/banners/hooks";
import { PAGE_TYPES, POSITIONS } from "@/services/banners/constants";
import { bannerFormSchema, type BannerFormValues } from "@/services/banners/schema";
import type { Language, UploadedFile } from "@/services/banners/types";

// Local preview descriptor for a freshly picked (not-yet-uploaded) logo File.
const describeFile = (file: File) => ({
  url: URL.createObjectURL(file),
  size: file.size,
  name: file.name,
  type: file.type,
});

type ImageSlots = Record<"web" | "mobile", Record<number, Partial<UploadedFile> & { type: string; language_id: number }>>;

// The form wrapper: owns validation + the create/update submit (FormData) logic.
const BannerForm = ({
  defaultValues,
  loading,
  open,
  className,
  children,
}: {
  defaultValues: Record<string, unknown>;
  loading: boolean;
  open: boolean;
  className?: string;
  children: (form: UseFormReturn<BannerFormValues>) => ReactNode;
}) => {
  const { id } = useParams();
  const { ads, closeAction, query } = useAds();
  const save = useSaveBanner({ bannerListQuery: { page: query.page, size: query.size }, onDone: closeAction });
  const form = useForm<BannerFormValues>({ defaultValues, resolver: zodResolver(bannerFormSchema) });

  const onSubmit = async (values: BannerFormValues) => {
    const collect = (kind: "web" | "mobile") =>
      Object.values((values.images?.[kind] as Record<number, { id?: number; type?: string; language_id?: number }>) || {}).reduce<
        { type: string; id: number; language_id?: number }[]
      >((acc, item) => {
        if (item?.id) acc.push({ type: item.type || kind, id: item.id, language_id: item.language_id });
        return acc;
      }, []);

    const images = [...collect("web"), ...collect("mobile")];
    const { images: _dropImages, logo = null, ...rest } = values;

    const formData = new FormData();
    if (logo && typeof logo !== "string") formData.append("logo", logo as Blob);
    images.forEach((image, index) => {
      formData.append(`images[${index}][id]`, String(image.id));
      formData.append(`images[${index}][language_id]`, String(image.language_id));
      formData.append(`images[${index}][type]`, image.type);
    });
    Object.entries(rest)
      .filter(([, value]) => value)
      .forEach(([key, value]) => formData.append(key, value as string));

    if (images.length === 0) {
      message.warning("Veb va mobile uchun rasmlarni ikki tilda yuklang!");
      return;
    }
    await new Promise<void>((resolve) => {
      save.mutate(
        {
          formData,
          id: values.id,
          action: values.id ? "update" : "create",
          banner_category_id: Number(id),
        },
        { onSettled: () => resolve() },
      );
    });
  };

  useEffect(() => {
    if (defaultValues?.id && open) {
      form.reset(defaultValues);
    } else {
      form.reset({
        images: { web: {}, mobile: {} },
        target_url_uz: undefined,
        title_uz: undefined,
        subtitle_uz: undefined,
        target_url_ru: undefined,
        subtitle_ru: undefined,
        title_ru: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, ads, open]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={["w-full", className].filter(Boolean).join(" ")}>
      {children(form)}
    </form>
  );
};

const WebFilePreview = ({ file }: { file: Partial<UploadedFile> }) =>
  file?.url ? (
    <div className="border-[1px] border-solid border-gray-200 rounded-[12px] h-[79px] p-[16px]">
      <div className="flex gap-[12px] items-center">
        <div className="bg-gray-200 w-[40px] h-[40px] rounded-[10px] flex justify-center items-center">
          <Icon name="monitor" className="w-[24px]" />
        </div>
        <div>
          <p className="text-gray-700 text-[14px] font-[500]">{file?.uuid}</p>
          <p>
            {file?.size} byte | {file?.file_format_type}
          </p>
        </div>
      </div>
    </div>
  ) : null;

const MobileFilePreview = ({ file }: { file: Partial<UploadedFile> }) =>
  file?.url ? (
    <div className="border-[1px] border-solid border-gray-200 rounded-[12px] h-[79px] p-[16px]">
      <div className="flex gap-[12px] items-center">
        <div className="bg-gray-200 w-[40px] h-[40px] rounded-[10px] flex justify-center items-center">
          <Icon name="phone" className="w-[24px]" />
        </div>
        <div>
          <p className="text-gray-700 text-[14px] font-[500]">{file?.uuid}</p>
          <p>
            {file?.size} byte | {file?.file_format_type}
          </p>
        </div>
      </div>
    </div>
  ) : null;

const DashedTile = ({ children }: { children: ReactNode }) => (
  <div className="flex justify-center border border-gray-200 border-dashed rounded-lg p-5 hover:border-blue-400 gap-[12px] text-gray-700 text-[16px]">
    <Icon name="downloadCloud" /> {children}
  </div>
);

// Create / edit banner form inside the modal (recovered from the build).
export const BannerFormModal = ({ open }: { open: boolean }) => {
  const [activeLang, setActiveLang] = useState<number>(0);
  const { getData, ads } = useAds();
  const { data: languages } = useLanguages({
    select: (list) => {
      if (list[0]?.id && !activeLang) setActiveLang(list[0].id);
    },
  });
  const { data: banner, isLoading, isFetching } = useBanner(getData?.ADS_UPDATE?.id);

  const normalized = {
    ...banner,
    expected_views: String(banner?.expected_views ?? ""),
    expected_clicks: String(banner?.expected_clicks ?? ""),
    images:
      banner?.images?.map((image) => ({
        ...image,
        language_id: languages?.find((lang) => lang.code === image.language_code)?.id,
      })) ?? [],
  };

  const emptySlots = useMemo<ImageSlots>(
    () => ({
      web: (languages ?? []).reduce<ImageSlots["web"]>((acc, lang) => {
        acc[lang.id] = { type: "web", language_id: lang.id };
        return acc;
      }, {}),
      mobile: (languages ?? []).reduce<ImageSlots["mobile"]>((acc, lang) => {
        acc[lang.id] = { type: "mobile", language_id: lang.id };
        return acc;
      }, {}),
    }),
    [languages],
  );

  const images = (normalized.images || []).reduce<ImageSlots>((acc, image) => {
    const kind = image.type as "web" | "mobile";
    if (acc[kind] && image.language_id) acc[kind][image.language_id] = image as never;
    return acc;
  }, emptySlots);

  const langOptions = (languages ?? []).map((lang: Language) => ({
    value: lang.id,
    label: lang.name,
    className: "text-gray-500",
  }));

  return (
    <div>
      <Spin spinning={isLoading || isFetching} indicator={<LoadingOutlined />}>
        <BannerForm
          className="flex flex-col gap-[20px]"
          defaultValues={{ ...normalized, images }}
          loading={isLoading || isFetching}
          open={open}
        >
          {({ control, watch, formState: { isSubmitting } }) => {
            const pageType = watch("page_type");
            const position = watch("position");
            const isMainTop = pageType === "main" && position === "top";
            return (
              <>
                <div className="flex gap-4">
                  <SelectField control={control} name="page_type" label="Sahifa nomi" placeholder="Tanlang">
                    {PAGE_TYPES.map((item) => (
                      <SelectField.Option key={item.name} value={item.name}>
                        {item.label}
                      </SelectField.Option>
                    ))}
                  </SelectField>
                  <SelectField control={control} name="position" label="Joylashuvi" placeholder="Tanlang">
                    {POSITIONS.map((item) => (
                      <SelectField.Option key={item.name} value={item.name}>
                        {item.label}
                      </SelectField.Option>
                    ))}
                  </SelectField>
                </div>
                <div className="flex gap-4">
                  <TextField
                    control={control}
                    name="expected_views"
                    label="Kutilayotgan ko‘rishlar soni"
                    placeholder="Kiriting"
                    type="number"
                    suffix={<span className="text-gray-400 text-[16px]">ta</span>}
                  />
                  <TextField
                    control={control}
                    name="expected_clicks"
                    label="Kutilayotgan bosishlar soni"
                    placeholder="Kiriting"
                    type="number"
                    suffix={<span className="text-gray-400 text-[16px]">ta</span>}
                  />
                </div>
                <div className="flex text-gray-500 gap-4">
                  <label className="bg-gray-100 w-full flex justify-between rounded-[12px] p-[12px] cursor-pointer">
                    Holati
                    <SwitchField control={control} name="status" className="w-min" />
                  </label>
                  <label className="bg-gray-100 w-full flex justify-between rounded-[12px] p-[12px] cursor-pointer">
                    Blank
                    <SwitchField control={control} name="blank" className="w-min" />
                  </label>
                </div>
                <hr className="h-px bg-gray-200 border-0" />
                {isMainTop && (
                  <ImageUploadField
                    control={control}
                    name="logo"
                    isNotShouldBeUploaded
                    fileListRender={(value) => {
                      const src = value instanceof File ? describeFile(value) : (value as Partial<UploadedFile> | string);
                      if (typeof src !== "string") {
                        return src?.url ? (
                          <div className="border-[1px] border-solid border-gray-200 rounded-[12px] h-[79px] p-[16px]">
                            <div className="flex gap-[12px] items-center">
                              <div className="bg-gray-200 w-[40px] h-[40px] rounded-[10px] flex justify-center items-center">
                                <Icon name="monitor" className="w-[24px]" />
                              </div>
                              <div>
                                <p className="text-gray-700 text-[14px] font-[500]">{(src as { name?: string }).name}</p>
                                <p>
                                  {(src as { size?: number }).size} byte | {(src as { type?: string }).type}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      }
                      return <img className="w-12 h-12 rounded-full object-contain" src={src} alt="Logo" />;
                    }}
                  >
                    <DashedTile>Logo</DashedTile>
                  </ImageUploadField>
                )}
                <div>
                  <Segmented
                    size="large"
                    className="text-gray-700 font-[600]"
                    onChange={(value) => setActiveLang(value as number)}
                    value={activeLang}
                    options={langOptions}
                  />
                </div>
                {languages?.map(
                  (lang) =>
                    lang.id === activeLang && (
                      <div key={lang.id} className="flex flex-col gap-[20px]">
                        <TextField
                          control={control}
                          name={`target_url_${lang.code}` as never}
                          label="Target link"
                          placeholder="https://example.com"
                        />
                        <div className="flex text-gray-500 gap-4">
                          <ImageUploadField
                            control={control}
                            name={`images.web.${lang.id}` as never}
                            language_id={lang.id}
                            fileListRender={(value) => <WebFilePreview file={value as Partial<UploadedFile>} />}
                          >
                            <DashedTile>Web platforma</DashedTile>
                          </ImageUploadField>
                          <ImageUploadField
                            control={control}
                            name={`images.mobile.${lang.id}` as never}
                            language_id={lang.id}
                            fileListRender={(value) => <MobileFilePreview file={value as Partial<UploadedFile>} />}
                          >
                            <DashedTile>Mobile ilova</DashedTile>
                          </ImageUploadField>
                        </div>
                        {isMainTop && (
                          <TextField control={control} name={`title_${lang.code}` as never} label="Sarlavha" placeholder="Sarlavha" />
                        )}
                        {isMainTop && (
                          <TextField
                            control={control}
                            name={`subtitle_${lang.code}` as never}
                            label="Sub sarlavha"
                            placeholder="Sub sarlavha"
                          />
                        )}
                      </div>
                    ),
                )}
                <Button type="primary" size="large" htmlType="submit" disabled={isSubmitting} loading={isSubmitting}>
                  {ads === "ADS_CREATE" ? "Yaratish" : "Saqlash"}
                </Button>
              </>
            );
          }}
        </BannerForm>
      </Spin>
    </div>
  );
};
