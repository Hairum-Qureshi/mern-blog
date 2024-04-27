import { ChangeEvent, useEffect, useState } from "react";
import form_css from "../../css/form.module.css";
import { Editor } from "@tinymce/tinymce-react";
import useBlogOperations from "../../hooks/useBlogOperations";
import useAuthContext from "../../contexts/authContext";
import { useLocation, useParams } from "react-router-dom";
import NotFound from "../NotFound";

export default function Form() {
	const { getBlogData, blogData, postBlog, loading } = useBlogOperations();
	const { userData } = useAuthContext()!;
	const { blog_id, user_id } = useParams();

	const location = useLocation().pathname;
	const [blogTitle, setBlogTitle] = useState<string>();
	const [blogSummary, setBlogSummary] = useState<string>();
	const [thumbnail, setThumbnail] = useState<File>();
	const [blogContent, setBlogContent] = useState<string>();

	useEffect(() => {
		if (blog_id !== undefined) {
			getBlogData(blog_id);
			setBlogTitle(blogData?.blog_title);
			setBlogSummary(blogData?.blog_summary);
			setBlogContent(blogData?.blog_content);
		} else {
			setBlogTitle("");
			setBlogSummary("");
			setBlogContent("");
		}
	}, [blogData, location]);

	// TODO - in the future, maybe add an option for users to select/add tags?
	// TODO - [x] make the input accept only image files
	// TODO - [ ] make the button disabled only if there is no thumbnail and blog summary
	// TODO - [x] when user posts their blog, redirect to their blog
	// TODO - [x] make it reusable so that it can handle editing blogs too
	// TODO - [ ] need to figure out how to populate the file input so that it has the blog's thumbnail
	// TODO - [ ] make the edit blog functionality work
	// !RESOLVE: - [ ] (bug) resolve issue where when editing, you're not able to change the content in the inputs + textarea

	function handleThumbnailUpload(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files) {
			const file = event.target.files[0];
			setThumbnail(file);
		}
	}

	return userData &&
		(userData.user_id === user_id ||
			userData.message !== "user does not exist") ? (
		<>
			<div className={form_css.mainContent}>
				{location.includes("edit") ? (
					<h1>EDIT BLOG</h1>
				) : (
					<h1>POST A NEW BLOG</h1>
				)}
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
							value={
								blog_id === undefined ? blogContent : blogData?.blog_content
							}
							onEditorChange={content => setBlogContent(content)}
						/>
					</div>
					<div className={form_css.section}>
						{location.includes("edit") ? (
							<button className={form_css.postBtn}>
								{loading ? "LOADING..." : "CONFIRM EDITS"}
							</button>
						) : (
							<button
								className={form_css.postBtn}
								disabled={!blogSummary && !thumbnail}
								onClick={() =>
									postBlog(blogTitle, blogSummary, thumbnail, blogContent)
								}
							>
								{loading ? "LOADING..." : "POST"}
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	) : (
		<NotFound />
	);
}
