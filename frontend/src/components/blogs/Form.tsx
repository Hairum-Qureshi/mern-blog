import { ChangeEvent, useState } from "react";
import form_css from "../../css/form.module.css";
import { Editor } from "@tinymce/tinymce-react";
import useBlogOperations from "../../hooks/useBlogOperations";

export default function Form() {
	const [blogTitle, setBlogTitle] = useState<string>();
	const [blogSummary, setBlogSummary] = useState<string>();
	const [thumbnail, setThumbnail] = useState<File>();
	const [blogContent, setBlogContent] = useState<string>();

	// TODO - in the future, maybe add an option for users to select/add tags?
	// TODO - [x] make the input accept only image files
	// TODO - [ ] make the button disabled only if there is no thumbnail and blog summary
	// TODO - [ ] when user posts their blog, redirect to their blog

	function handleThumbnailUpload(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files) {
			const file = event.target.files[0];
			setThumbnail(file);
		}
	}

	const { postBlog } = useBlogOperations();

	return (
		<>
			<div className={form_css.mainContent}>
				<h1>POST A NEW BLOG</h1>
				<div className={form_css.form}>
					<div className={form_css.section}>
						<label htmlFor="Blog Title">TITLE</label>
						<input
							type="text"
							name="Blog Title"
							placeholder="Blog Title"
							value={blogTitle}
							onChange={e => setBlogTitle(e.target.value)}
						/>
					</div>
					<div className={form_css.section}>
						<label htmlFor="Blog Summary">BLOG SUMMARY</label>
						<textarea
							name="Blog Summary"
							placeholder="Blog Summary"
							value={blogSummary}
							onChange={e => setBlogSummary(e.target.value)}
						></textarea>
					</div>
					<div className={form_css.section}>
						<label htmlFor="Blog Cover Photo">UPLOAD COVER PHOTO</label>
						<div className={form_css.input_container}>
							<input
								type="file"
								name="Blog Cover Photo"
								onChange={handleThumbnailUpload}
								accept="image/png, image/gif, image/jpeg"
							/>
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
							onEditorChange={content => setBlogContent(content)}
						/>
					</div>
					<div className={form_css.section}>
						<button
							className={form_css.postBtn}
							disabled={!blogSummary && !thumbnail}
							onClick={() =>
								postBlog(blogTitle, blogSummary, thumbnail, blogContent)
							}
						>
							POST
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
