// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice, current } from "@reduxjs/toolkit";
const initialState = {
  main: {
    name: "Shablon1",
    borderRadius: 30,
    borderColor: "rgba(208, 213, 221, 1)",
    fontFamily: "sans-serif",
    leftWidth: 300,
    fullWidth: 860,
    leftBackgroundColor: "#fff",
    leftBackgroundImage: "",
    rightBackgroundColor: "#fff",
    rightBackgroundImage: "",
    boxShadow: false,
    height: 696,
    pipeStatusId: null,
    tagsId: null,
    redirectUrl: "",
    redirectTime: 0,
    textSubmission: "",
    formId: null,
    openShablon: false,
    pageBackgroundColor: "",
    pageBackgroundImage: "",
    checked: false,
  },
  leftHeader: {
    header: {
      fontWeight: "bold",
      fontStyle: "",
      textDecoration: "",
      textAlign: "left",
      color: "rgba(70, 66, 85, 1)",
      content: "Header",
      fontSize: 24,
    },
    paragraph: {
      fontWeight: "",
      fontStyle: "",
      textDecoration: "",
      textAlign: "left",
      color: "rgba(70, 66, 85, 1)",
      content: "Paragraph",
      fontSize: 14,
    },
  },
  fields: {
    3: {
      name: "board1",
      activeTask: "none",
      items: [
        {
          label: "Telefon raqam",
          name: "Telefon raqam",
          companyLeadFieldId: null,
          placeHolder: "",
          required: true,
          requiredMessage: "",
          step: 0,
          type: "PHONE",
        },
        {
          label: "Ismi",
          name: "Ismi",
          companyLeadFieldId: null,
          placeHolder: "",
          required: true,
          requiredMessage: "",
          step: 1,
          type: "NAME_CONTACT",
        },
      ],
    },
    4: {
      name: "board2",
      activeTask: "none",
      items: [],
    },
  },
  fieldsStyle: {
    height: 40,
    borderRadius: "SQUARE",
    fieldBorderColor: "",
    fieldBackgroundColor: "",
    color: "#00A389",
    fieldBorderType: "SQUARE",
    fieldSize: 14,
  },
  textPosition: {
    labelPosition: "block",
  },
  submitButton: {
    fontWeight: "",
    fontStyle: "",
    textDecoration: "",
    justifyContent: "left",
    borderRadius: "SQUARE",
    color: "#fff",
    backgroundColor: "#3cbd9f",
    value: "Yuborish",
    width: 0,
  },
  leftBgImgBinary: undefined,
  rightBgImgBinary: undefined,
  pageBackImg: undefined,
};
const U1 = createSlice({
  name: "text-editor",
  initialState,
  reducers: {
    mainBorderRadius: (e, t) => {
      e.main.borderRadius = t.payload;
    },
    mainBorderColor: (e, t) => {
      e.main.borderColor = t.payload;
    },
    mainFontFamily: (e, t) => {
      e.main.fontFamily = t.payload;
    },
    mainLeftWidth: (e, t) => {
      e.main.leftWidth = t.payload;
    },
    mainFullWidth: (e, t) => {
      e.main.fullWidth = t.payload;
    },
    mainLeftBackgroundColor: (e, t) => {
      e.main.leftBackgroundColor = t.payload;
    },
    mainRightBackgroundColor: (e, t) => {
      e.main.rightBackgroundColor = t.payload;
    },
    mainRightBackgroundImage: (e, t) => {
      e.main.rightBackgroundImage = t.payload;
    },
    mainBoxShadow: (e, t) => {
      e.main.boxShadow = t.payload;
    },
    changeFormName: (e, t) => {
      e.main.name = t.payload;
    },
    mainHeight: (e, t) => {
      e.main.height = t.payload;
    },
    changePipeStatusId: (e, t) => {
      e.main.pipeStatusId = t.payload;
    },
    changeTagsId: (e, t) => {
      e.main.tagsId = t.payload;
    },
    changeFontWeight: (e, t) => {
      const { fontWeight } = e.leftHeader[t.payload.type];
      if (fontWeight === t.payload.fontWeight) {
        e.leftHeader[t.payload.type].fontWeight = "";
      } else {
        e.leftHeader[t.payload.type].fontWeight = t.payload.fontWeight;
      }
    },
    changeFontStyle: (e, t) => {
      const { fontStyle } = e.leftHeader[t.payload.type];
      if (fontStyle === t.payload.fontStyle) {
        e.leftHeader[t.payload.type].fontStyle = "";
      } else {
        e.leftHeader[t.payload.type].fontStyle = t.payload.fontStyle;
      }
    },
    changeTextDecoration: (e, t) => {
      const { textDecoration } = e.leftHeader[t.payload.type];
      if (textDecoration === t.payload.textDecoration) {
        e.leftHeader[t.payload.type].textDecoration = "";
      } else {
        e.leftHeader[t.payload.type].textDecoration = t.payload.textDecoration;
      }
    },
    changeTextAlign: (e, t) => {
      e.leftHeader[t.payload.type].textAlign = t.payload.textAlign;
    },
    changeTextColor: (e, t) => {
      e.leftHeader[t.payload.type].color = t.payload.color;
    },
    changeTextContent: (e, t) => {
      e.leftHeader[t.payload.type].content = t.payload.content;
    },
    changeTextSize: (e, t) => {
      e.leftHeader[t.payload.type].fontSize = t.payload.fontSize;
    },
    changeRedirectUrl: (e, t) => {
      e.main.redirectUrl = t.payload;
    },
    changeRedirectTime: (e, t) => {
      e.main.redirectTime = t.payload;
    },
    changeTextSubmission: (e, t) => {
      e.main.textSubmission = t.payload;
    },
    setChangePageBackgroundColor: (e, t) => {
      e.main.pageBackgroundColor = t.payload;
    },
    setChangeChecked: (e, t) => {
      e.main.checked = t.payload;
    },
    fieldDragDrop: (e, t) => {
      const t_payload = t.payload;
      if (!t_payload.destination) {
        return;
      }
      const { source, destination } = t_payload;
      const e_fields = e.fields;
      if (source.droppableId !== destination.droppableId) {
        const o = e_fields[Number(source?.droppableId)];
        const s = e_fields[Number(destination.droppableId)];
        const items = [...o.items];
        const c = [...s.items];
        const u = items[source.index];
        const [d] = items.splice(source.index, u?.public ? 0 : 1);
        c.splice(destination.index, 0, u?.public ? u : d);
        e.fields = {
          ...e_fields,
          [source.droppableId]: {
            ...o,
            items,
          },
          [destination.droppableId]: {
            ...s,
            items: c.map((f, h) => ({
              ...f,
              label: f.name,
              step: h,
            })),
          },
        };
      } else {
        const o = e_fields[Number(source.droppableId)];
        const s = [...o.items];
        const [l] = s.splice(source.index, 1);
        s.splice(destination.index, 0, l);
        e.fields = {
          ...e_fields,
          [source.droppableId]: {
            ...o,
            items: s.map((c, u) => ({
              ...c,
              step: u,
            })),
          },
        };
      }
    },
    removeField: (e, t) => {
      const { index } = t.payload;
      e.fields[3].items[index].label = e.fields[3].items[index].name;
      if (!e.fields[3]?.items[index].public) {
        e.fields[4].items.push(e.fields[3]?.items[index]);
      }
      e.fields[3].items = e.fields[3].items
        ?.filter((n, i) => i !== index)
        .map((n, i) => ({
          ...n,
          step: i,
        }));
    },
    changeFaildLabel: (e, t) => {
      e.fields[3].items[t.payload.index].label = t.payload.label;
    },
    changeFaildContent: (e, t) => {
      e.fields[3].items[t.payload.index].placeHolder = t.payload.content;
    },
    changeFieldRequired: (e, t) => {
      e.fields[3].items[t.payload.index].required = t.payload.switch;
    },
    changeFaildMessage: (e, t) => {
      e.fields[3].items[t.payload.index].requiredMessage = t.payload.message;
    },
    changeFieldBorderRadius: (e, t) => {
      e.fieldsStyle.fieldBorderType = t.payload;
    },
    changeFieldHeight: (e, t) => {
      e.fieldsStyle.height = t.payload;
    },
    changeFieldBorderColor: (e, t) => {
      e.fieldsStyle.fieldBorderColor = t.payload;
    },
    changeFieldBackgroundColor: (e, t) => {
      e.fieldsStyle.fieldBackgroundColor = t.payload;
    },
    changeFieldColor: (e, t) => {
      e.fieldsStyle.color = t.payload;
    },
    textPositionLeft: (e, t) => {
      e.textPosition.labelPosition = t.payload;
    },
    submitFontWeight: (e, t) => {
      const { fontWeight } = e.submitButton;
      if (fontWeight === t.payload) {
        e.submitButton.fontWeight = "";
      } else {
        e.submitButton.fontWeight = t.payload;
      }
    },
    submitFontStyle: (e, t) => {
      const { fontStyle } = e.submitButton;
      if (fontStyle === t.payload) {
        e.submitButton.fontStyle = "";
      } else {
        e.submitButton.fontStyle = t.payload;
      }
    },
    submitTextDecoration: (e, t) => {
      const { textDecoration } = e.submitButton;
      if (textDecoration === t.payload) {
        e.submitButton.textDecoration = "";
      } else {
        e.submitButton.textDecoration = t.payload;
      }
    },
    submitJustifyContent: (e, t) => {
      e.submitButton.justifyContent = t.payload;
    },
    submitBorderRadius: (e, t) => {
      e.submitButton.borderRadius = t.payload;
    },
    submitBackgroundColor: (e, t) => {
      e.submitButton.backgroundColor = t.payload;
    },
    submitColor: (e, t) => {
      e.submitButton.color = t.payload;
    },
    submitValue: (e, t) => {
      e.submitButton.value = t.payload;
    },
    submitBUttonWidth: (e, t) => {
      e.submitButton.width = t.payload;
    },
    addData: (e, t) => {
      e.fields[4].items = t.payload;
    },
    setEditForm: (e, t) => {
      const { fields } = current(e);
      const n = t.payload.staticElementFormDto.find((l) => l?.type === "HEADER");
      const i = t.payload.staticElementFormDto.find((l) => l?.type === "PARAGRAPH");
      const a = t.payload.staticElementFormDto.find((l) => l?.type === "BUTTON");
      const o = (text) => {
        if (text && text.replace(/<[^>]*>/g, "").trim()) {
          return text;
        }
        return "";
      };
      const s = (l) => {
        const c = l?.map((u) => u?.toUpperCase()) || [];
        return {
          fontWeight: c.includes("BOLD") ? "bold" : "",
          fontStyle: c.includes("ITALIC") ? "italic" : "",
          textDecoration: c.includes("UNDERLINE") ? "underline" : "",
        };
      };
      e.leftHeader = {
        ...e.leftHeader,
        header: {
          ...e.leftHeader.header,
          ...s(n?.fontStyle),
          color: n?.textColor,
          content: n ? o(n.text) : initialState.leftHeader.header.content,
          fontSize: n?.textSize || 23,
          textAlign: n?.alignment?.toLowerCase() || "left",
        },
        paragraph: {
          ...e.leftHeader.paragraph,
          ...s(i?.fontStyle),
          color: i?.textColor,
          content: i ? o(i.text) : initialState.leftHeader.paragraph.content,
          fontSize: i?.textSize || 13,
          textAlign: i?.alignment?.toLowerCase() || "left",
        },
      };
      e.fieldsStyle = {
        ...e.fieldsStyle,
        borderRadius: String(t.payload.style.borderRadius) || "0",
        color: t.payload.style.fontColor || "#00A389",
        fieldBackgroundColor: t.payload.style.fieldBackgroundColor,
        fieldBorderColor: t.payload.style.fieldBorderColor || "",
        fieldBorderType: t.payload.style.fieldBorderType || "SQUARE",
        fieldSize: t.payload.style.fontSize || 14,
        height: t.payload.style.fieldHeight || 40,
      };
      e.main = {
        ...e.main,
        borderColor: t.payload.style.borderColor,
        borderRadius: t.payload.style.borderRadius || 40,
        boxShadow: t.payload.style.boxShadow || false,
        fontFamily: t.payload.style.fontFamily,
        fullWidth: t.payload.style.leftWidth + t.payload.style.rightWidth || 860,
        height: t.payload.style.height || 696,
        leftBackgroundColor: t.payload.style.leftBackgroundColor,
        leftBackgroundImage: t.payload.style.leftBackgroundImage,
        leftWidth: t.payload.style.leftWidth || 300,
        name: t.payload.name,
        pipeStatusId: t.payload.pipeStatusId,
        redirectTime: t.payload.redirectTime,
        redirectUrl: t.payload.redirectUrl,
        rightBackgroundColor: t.payload.style.rightBackgroundColor,
        rightBackgroundImage: t.payload.style.rightBackgroundImage,
        tagsId: t.payload.tagIds || null,
        textSubmission: t.payload.textSubmission,
        pageBackgroundImage: t.payload.style.pageBackgroundImage,
        pageBackgroundColor: t.payload.style.pageBackgroundColor,
      };
      e.submitButton = {
        ...e.submitButton,
        ...s(a.fontStyle),
        backgroundColor: a.buttonColor || "",
        borderRadius: a.buttonBorderType || "SQUARE",
        color: a.textColor,
        justifyContent: a.alignment?.toLowerCase() || "left",
        value: o(a.text) || "Yuborish",
        width: a.buttonWidth || 200,
      };
      e.textPosition = {
        ...e.textPosition,
        labelPosition: t.payload.style.labelPosition === "LEFT" ? "flex" : "block",
      };
      e.fields[3].items = t.payload.elements
        ?.sort((l, c) => l?.step - c?.step)
        .map((l) => ({
          ...l,
          id: l?.companyLeadFieldId,
          name: l?.label,
        }));
      e.fields[4].items = fields[4].items.filter(
        (l) => !t.payload.elements.some((c) => c?.companyLeadFieldId === l.id)
      );
    },
    clearForm: (e) => {
      e.fields = {
        3: initialState.fields[3],
        4: {
          name: "board2",
          activeTask: "none",
          items: [
            ...e?.fields[4]?.items,
            ...e?.fields[3]?.items?.filter((t) => t?.label !== "Phone"),
          ],
        },
      };
      e.fieldsStyle = initialState.fieldsStyle;
      e.leftHeader = initialState.leftHeader;
      e.main = initialState.main;
      e.submitButton = initialState.submitButton;
      e.textPosition = initialState.textPosition;
      e.leftBgImgBinary = initialState.leftBgImgBinary;
      e.rightBgImgBinary = initialState.rightBgImgBinary;
      e.pageBackImg = initialState.pageBackImg;
    },
    applyTheme: (e, t) => {
      const t_payload = t.payload;
      e.main.leftBackgroundColor = t_payload.leftBackgroundColor;
      e.main.rightBackgroundColor = t_payload.rightBackgroundColor;
      e.main.borderColor = t_payload.borderColor;
      e.leftHeader.header.color = t_payload.headerColor;
      e.leftHeader.paragraph.color = t_payload.paragraphColor;
      e.fieldsStyle.color = t_payload.labelColor;
      e.fieldsStyle.fieldBackgroundColor = t_payload.fieldBackgroundColor;
      e.fieldsStyle.fieldBorderColor = t_payload.fieldBorderColor;
      e.submitButton.backgroundColor = t_payload.buttonColor;
      e.submitButton.color = t_payload.buttonTextColor;
    },
    getFormId: (e, t) => {
      e.main.formId = t.payload;
    },
    setBgImgBinary: (e, t) => {
      if (t.payload.type === "rightImgBinary") {
        e.rightBgImgBinary = t.payload.backImage;
      } else if (t.payload.type === "backImg") {
        e.pageBackImg = t.payload.backImage;
      } else {
        e.leftBgImgBinary = t.payload.backImage;
      }
    },
    setChangeBackColor: (e, t) => {
      if (t.payload.type === "rightImgBinary") {
        e.main.rightBackgroundColor = t.payload.backColor;
      } else {
        e.main.leftBackgroundColor = t.payload.backColor;
      }
    },
    setOpenShablon: (e, t) => {
      e.main.openShablon = t.payload;
    },
    setFieldsFontSize: (e, t) => {
      e.fieldsStyle.fieldSize = t.payload;
    },
    deleteBgImage: (e, t) => {
      if (t.payload.side === "left") {
        e.main.leftBackgroundImage = "";
        e.leftBgImgBinary = "";
      } else if (t.payload.side === "right") {
        e.main.rightBackgroundImage = "";
        e.rightBgImgBinary = "";
      } else {
        e.main.pageBackgroundImage = "";
        e.pageBackImg = "";
      }
    },
    setCommonBgImage: (e, t) => {
      e.leftBgImgBinary = t.payload;
      e.rightBgImgBinary = t.payload;
      e.main.leftBackgroundImage = t.payload;
      e.main.rightBackgroundImage = t.payload;
    },
    deleteCommonBgImage: (e) => {
      e.leftBgImgBinary = "";
      e.rightBgImgBinary = "";
      e.main.leftBackgroundImage = "";
      e.main.rightBackgroundImage = "";
    },
  },
});
const {
  changeFontStyle: yte,
  changeFontWeight,
  changeTextDecoration: bte,
  changeTextAlign: Ste,
  changeTextColor: Ete,
  changeTextSize: Cte,
  fieldDragDrop: xte,
  removeField: wte,
  changeFieldBorderRadius: Pte,
  changeFieldHeight: Ite,
  changeFieldColor: Ate,
  changeFieldBorderColor: Tte,
  changeFieldBackgroundColor: Rte,
  changeFieldRequired: Ote,
  textPositionLeft: Nte,
  submitFontWeight: kte,
  submitFontStyle: Mte,
  submitTextDecoration: Dte,
  submitJustifyContent: Lte,
  submitBorderRadius: Fte,
  submitBackgroundColor,
  submitColor: jte,
  submitValue: Bte,
  submitBUttonWidth: Vte,
  mainBorderRadius: Ute,
  mainBorderColor: Hte,
  mainFontFamily: zte,
  mainLeftWidth: Wte,
  mainFullWidth: qte,
  mainLeftBackgroundColor: Gte,
  mainRightBackgroundColor: Yte,
  mainBoxShadow: Kte,
  changeFormName: Xte,
  changeFaildLabel: Jte,
  changeFaildContent: Qte,
  changeFaildMessage: Zte,
  changeTextContent: ere,
  changeRedirectUrl: tre,
  changeRedirectTime: rre,
  changeTextSubmission: nre,
  addData: ire,
  mainHeight: are,
  changePipeStatusId: ore,
  changeTagsId: sre,
  setEditForm: lre,
  applyTheme: cre,
  clearForm: ure,
  getFormId: dre,
  setBgImgBinary: fre,
  setOpenShablon: hre,
  setFieldsFontSize: pre,
  setChangePageBackgroundColor: vre,
  setChangeChecked: gre,
  setChangeBackColor: mre,
  deleteBgImage: yre,
  setCommonBgImage,
  deleteCommonBgImage: bre,
} = U1.actions;
export { U1 };
