import { ChangeEvent, useEffect, useState } from "react";
import form_css from "../../css/form.module.css";
import { Editor } from "@tinymce/tinymce-react";
import useBlogOperations from "../../hooks/useBlogOperations";
import useAuthContext from "../../contexts/authContext";
import { useLocation, useParams } from "react-router-dom";
import NotFound from "../NotFound";
import AlertPopUp from "../AlertPopUp";

export default function Form() {
	const { getBlogData, blogData, postBlog, loading, editBlog } =
		useBlogOperations();
	const { userData } = useAuthContext()!;
	const { blog_id, user_id, blog_name } = useParams();

	const location = useLocation().pathname;
	const [blogTitle, setBlogTitle] = useState<string>();
	const [blogSummary, setBlogSummary] = useState<string>();
	const [thumbnail, setThumbnail] = useState<File>();
	const [blogContent, setBlogContent] = useState<string>();
	const [tag, setTag] = useState<string>("");
	const [blogTags, setBlogTags] = useState<string[]>([]);
	const [showPopUp, setShowPopUp] = useState(false);
	const [popUpData, setPopUpData] = useState({
		symbol: "",
		message: ""
	});

	useEffect(() => {
		if (blog_id !== undefined && blog_name !== undefined) {
			getBlogData(blog_id, blog_name);
		}
	}, [blog_id]);

	useEffect(() => {
		if (blogData) {
			setBlogTitle(blogData.blog_title);
			setBlogSummary(blogData.blog_summary);
			setBlogContent(blogData.blog_content);
			setBlogTags(blogData?.tags);
		}
	}, [blogData]);

	// TODO - in the future, maybe add an option for users to select/add tags?
	// TODO - [ ] make the button disabled only if there is no thumbnail and blog summary
	// TODO - [ ] need to figure out how to populate the file input so that it has the blog's thumbnail
	// TODO - [ ] make the edit blog functionality work
	// TODO - [x] need to lead user to the "create blog" form if they enter a blog ID to edit that doesn't exist
	// 		  --> may need to lead users to a 404 page IF they somehow try and edit a blog with an existing ID that they don't own
	// TODO - [ ] need to lead user to a 404 page if they tamper with the user ID in the post blog route
	// TODO - [ ] add the styling to add a red asterisk besides the required fields
	// TODO - [ ] improve error handling for the form by making sure all required fields are answered before submitting
	// TODO - [ ] need to update the edit blog form so it also has the option to showcase the user's tags for that blog
	// 		  --> will also need to add a check to make sure the user has at least 1 tag provided before posting a blog and editing
	//            a blog
	// TODO - [ ] add loading message when user makes edits to a blog
	// TODO - [ ] maybe on the edit page, display the blog's current thumbnail image

	function handleThumbnailUpload(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files) {
			const file = event.target.files[0];
			setThumbnail(file);
		}
	}

	function resetPopUpState() {
		setTimeout(() => {
			setShowPopUp(false);
			setPopUpData({ symbol: "", message: "" });
		}, 1000);
	}

	function createAlert(symbol: string, message: string) {
		setShowPopUp(true);
		setPopUpData({ symbol, message });
		resetPopUpState();
	}

	function createTag(e: React.KeyboardEvent<HTMLInputElement>) {
		const inputElement = e.target as HTMLInputElement;
		if (e.key === "Enter") {
			if (!inputElement.value.trim()) {
				createAlert("⚠️", "Please enter a tag");
			} else if (blogTags.includes(inputElement.value.trim())) {
				createAlert("⚠️", "No duplicate tags");
			} else {
				setBlogTags([
					...blogTags,
					inputElement.value
						.trim()
						.replace(/['",!@#$%^&*()_+\-=[\]{}|\\:;,.<>?/~`]/g, "")
						.replace(/\s+/g, "-")
				]);
				setTag("");
			}
		} else if (e.key === "Backspace") {
			if (blogTags.length > 0 && !inputElement.value) {
				const index = blogTags.length - 1;
				const previousTag = blogTags[index];
				const filteredTags = blogTags.slice(0, index); // Remove the last tag
				setBlogTags(filteredTags); // Update the blogTags state with the filtered tags
				setTag(previousTag + " "); // Set the previous tag in the input field with a space for editing
			}
		}
	}

	function deleteTag(index: number) {
		const tagsCopy = [...blogTags];
		const tagToRemove: string = blogTags[index];
		const filteredTags: string[] = tagsCopy.filter(
			(tag: string) => tag !== tagToRemove
		);
		setBlogTags(filteredTags);
	}

	function verify(mode: string) {
		switch (mode) {
			case "post":
				if (!blogSummary || !blogContent || thumbnail === undefined) {
					createAlert(
						"⚠️",
						"Please make sure all required fields are filled in"
					);
				} else if (blogTags.length < 1) {
					createAlert("⚠️", "Please add at least 1 tag");
				} else {
					postBlog(blogTitle, blogSummary, thumbnail, blogContent, blogTags);
				}
				break;
			case "edit":
				if (!blogSummary || !blogContent) {
					createAlert(
						"⚠️",
						"Please make sure all required fields are filled in"
					);
				} else if (blogTags.length < 1) {
					createAlert("⚠️", "Please add at least 1 tag");
				} else {
					editBlog(
						blogTitle,
						blogSummary,
						thumbnail,
						blogContent,
						blog_id,
						blogTags
					);
				}
				break;
		}
	}

	return userData &&
		(userData.user_id === user_id ||
			userData.message !== "user does not exist") ? (
		<>
			{showPopUp ? (
				<AlertPopUp>
					<p>
						<span>{popUpData.symbol}</span> &nbsp;
						{popUpData.message}
					</p>
				</AlertPopUp>
			) : null}
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
							onChange={e => {
								setBlogTitle(e.target.value);
							}}
						/>
					</div>
					<div className={form_css.section}>
						<label htmlFor="Blog Summary">
							BLOG SUMMARY&nbsp;
							<span className={form_css.requiredAsterisk}>*</span>
						</label>
						<textarea
							name="Blog Summary"
							placeholder="Blog Summary"
							value={blogSummary}
							onChange={e => setBlogSummary(e.target.value)}
						></textarea>
					</div>
					<div className={form_css.section}>
						<label htmlFor="blog-cover-photo">
							{location.includes("edit")
								? "UPLOAD A NEW THUMBNAIL (leaving this blank will keep your old thumbnail)"
								: "UPLOAD THUMBNAIL"}
							&nbsp;<span className={form_css.requiredAsterisk}>*</span>
						</label>
						<div className={form_css.input_container}>
							<input
								type="file"
								id="blog-cover-photo"
								name="blog-cover-photo"
								onChange={handleThumbnailUpload}
								accept="image/png, image/gif, image/jpeg"
							/>
						</div>
					</div>
					<div className={form_css.section}>
						<label htmlFor="Blog Tags">
							ENTER UP TO 5 TAGS (MINIMUM 1 TAG)&nbsp;
							<span className={form_css.requiredAsterisk}>*</span>
						</label>
						<div className={form_css.tagInput}>
							{blogTags.map((tag: string, index: number) => {
								return (
									<div className={form_css.tag} key={index}>
										<span className={form_css.text}>{tag}</span>
										<span
											className={form_css.closeBtn}
											onClick={() => deleteTag(index)}
										>
											&times;
										</span>
									</div>
								);
							})}
							{blogTags.length !== 5 ? (
								<input
									type="text"
									maxLength={15}
									value={tag}
									placeholder="Hit the 'enter' key to add a tag"
									onChange={e => setTag(e.target.value)}
									onKeyDown={e => createTag(e)}
								></input>
							) : null}
						</div>
					</div>
					<div className={form_css.section}>
						<label htmlFor="Blog Content">
							BLOG CONTENT <span className={form_css.requiredAsterisk}>*</span>
						</label>
						<Editor
							apiKey="3yf5k1pk6g0p91zk31p0b21v6t866snm11z992jm62zc2cqb"
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
							value={blogContent}
							onEditorChange={content => setBlogContent(content)}
						/>
					</div>
					<div className={form_css.section}>
						{location.includes("edit") ? (
							<button
								className={form_css.postBtn}
								onClick={() => verify("edit")}
							>
								{loading ? "LOADING..." : "CONFIRM EDITS"}
							</button>
						) : (
							<button
								className={form_css.postBtn}
								onClick={() => verify("post")}
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
