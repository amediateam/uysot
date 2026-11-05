import { zodResolver } from "@hookform/resolvers/zod";
import { Dropdown, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, type ReactNode } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { DASHED_BORDER_IMAGE } from "@/assets/dashed-border";
import { Icon } from "@/components/ui/Icon";
import { TextField } from "@/components/ui/form-fields";
import { useDeleteBannerCategory, useSaveBannerCategory } from "@/services/banners/hooks";
import { categorySchema, type CategoryForm } from "@/services/banners/schema";
import type { BannerCategory } from "@/services/banners/types";

// Inline rename form for a category (recovered from the build).
const CategoryRenameForm = ({
  defaultValues,
  children,
}: {
  defaultValues: Partial<CategoryForm>;
  children: (form: UseFormReturn<CategoryForm>) => ReactNode;
}) => {
  const save = useSaveBannerCategory();
  const form = useForm<CategoryForm>({ resolver: zodResolver(categorySchema), defaultValues });
  const onSubmit = async (values: CategoryForm) => {
    await new Promise<void>((resolve) => save.mutate(values, { onSettled: () => resolve() }));
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      {children(form)}
    </form>
  );
};

// A banner-category ("Reklama to'plami") card, or the "create" tile (recovered from the build).
export const CategoryCard = ({ item, create }: { item?: BannerCategory; create?: boolean }) => {
  const remove = useDeleteBannerCategory();
  const [renaming, setRenaming] = useState(false);

  const menuItems = [
    {
      key: "1",
      label: <span className="text-gray-700 tex-[14px] font-[500]">Tahrirlash</span>,
      icon: <Icon name="edit" className="w-[20px] h-[20px] text-gray-700" />,
      onClick: () => setRenaming((prev) => !prev),
    },
    {
      key: "2",
      label: <span className="text-gray-700 tex-[14px] font-[500]">O’chirish </span>,
      icon: remove.isPending ? <LoadingOutlined spin /> : <Icon name="trush" className="w-[20px] h-[20px] text-gray-700" />,
      onClick: () => !remove.isPending && item && remove.mutate(item.id),
    },
  ];

  if (create && !renaming) {
    return (
      <div
        className="cursor-pointer rounded-[12px] border-transparent border-solid border-[20px] h-[74px] flex items-center justify-center text-[15px] font-[600] text-gray-400 gap-[12px]"
        style={{ borderImage: `url(${DASHED_BORDER_IMAGE}) 30 round` }}
        onClick={() => setRenaming(true)}
      >
        <Icon name="folderPlus" /> Reklama tuplami yaratish
      </div>
    );
  }

  return (
    <Spin spinning={remove.isPending} indicator={<LoadingOutlined spin />}>
      <Link
        to={create ? "#" : `/main/advetising/${item?.id}/${item?.name}`}
        className="rounded-[12px] bg-white border-gray-200 border-solid border-[1px] p-[16px] flex justify-between "
      >
        <div className="flex gap-[16px]">
          <div>
            <Icon name="folder" className="h-[67] w-[52px] text-primary-500" />
          </div>
          {renaming ? (
            <CategoryRenameForm defaultValues={{ name: item?.name, id: item?.id }}>
              {({ control, formState: { isSubmitting, isSubmitSuccessful } }) => {
                if (isSubmitSuccessful) setRenaming(false);
                return (
                  <div className="flex items-center gap-[8px]" onClick={(e) => e.preventDefault()}>
                    <TextField
                      control={control}
                      name="name"
                      size="small"
                      autoFocus
                      disabled={isSubmitting}
                      onBlurCapture={() => !isSubmitting && setRenaming(false)}
                    />
                    {isSubmitting && <LoadingOutlined spin />}
                  </div>
                );
              }}
            </CategoryRenameForm>
          ) : (
            <div>
              <h3 className="font-[600] text-[16px] text-gray-700">{item?.name}</h3>
              <p className="font-[500] text-[14px] text-gray-400">{item?.banners_count} dona reklama</p>
            </div>
          )}
        </div>
        {!create && (
          <Dropdown
            menu={{ items: menuItems, onClick: (info) => info.domEvent.preventDefault() }}
            overlayClassName="w-[240px]"
            trigger={["click"]}
          >
            <span onClick={(e) => e.preventDefault()}>
              <Icon name="dotsVertical" className="h-[18px] w-[18px] cursor-pointer" />
            </span>
          </Dropdown>
        )}
      </Link>
    </Spin>
  );
};
