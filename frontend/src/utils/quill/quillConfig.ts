import { Quill } from "react-quill";

const FontAttributor = Quill.import("attributors/class/font");
FontAttributor.whitelist = ["WorkSans"];
Quill.register(FontAttributor, true);

const Size = Quill.import("attributors/style/size");
Size.whitelist = ["12px", "14px", "16px", "18px", "24px", "28px", "32px"];
Quill.register(Size, true);

export const modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }, { font: ["WorkSans"] }],
		[{ size: ["12px", "14px", "16px", "18px", "24px", "28px", "32px"] }],
		["bold", "italic", "underline", "strike", "blockquote"],
		[{ list: "ordered" }, { list: "bullet" }],
		["link", "image"],
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
export const formats = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"underline",
	"strike",
	"blockquote",
	"list",
	"bullet",
	"link",
	"image",
];
