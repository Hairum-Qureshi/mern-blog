import { useState } from "react";
import form_css from "../../css/form.module.css";
import { Editor } from "@tinymce/tinymce-react";

export default function Form() {
	const [blogTitle, setBlogTitle] = useState<string>();
	const [blogSummary, setBlogSummary] = useState<string>();
	const [coverImage, setCoverImage] = useState<File>();
	const [blogContent, setBlogContent] = useState<string>();

	return (
		<>
			<div className={form_css.mainContent}>
				<h1>POST A NEW BLOG</h1>
				<div className={form_css.form}>
					<div className={form_css.section}>
						<label htmlFor="Blog Title">TITLE</label>
						<input type="text" name="Blog Title" placeholder="Blog Title" />
					</div>
					<div className={form_css.section}>
						<label htmlFor="Blog Summary">BLOG SUMMARY</label>
						<textarea name="Blog Summary" placeholder="Blog Summary"></textarea>
					</div>
					<div className={form_css.section}>
						<label htmlFor="Blog Cover Photo">UPLOAD COVER PHOTO</label>
						<div className={form_css.input_container}>
							<input type="file" name="Blog Cover Photo" />
						</div>
					</div>
					<div className={form_css.section}>
						<label htmlFor="Blog Content">BLOG CONTENT</label>
						<Editor
							apiKey="3yf5k1pk6g0p91zk31p0b21v6t866snm11z992jm62zc2cqb"
							// initialValue="<p>This is the initial content of the editor.</p>"
							init={{
								plugins:
									"anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
								toolbar:
									"undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | addcomment showcomments | spellcheck a11ycheck typography | align lineheight |  numlist bullist indent outdent | emoticons charmap | removeformat",
								tinycomments_mode: "embedded",
								mergetags_list: [
									{ value: "First.Name", title: "First Name" },
									{ value: "Email", title: "Email" }
								],
								branding: false
							}}
						/>
					</div>
					<div className={form_css.section}>
						<button className={form_css.postBtn}>POST</button>
					</div>
				</div>
			</div>
		</>
	);
}
