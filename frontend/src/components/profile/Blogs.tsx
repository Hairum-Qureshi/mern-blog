import { useEffect } from "react";
import useAuthContext from "../../contexts/authContext";
import useProfileData from "../../hooks/useProfileData";
import { useSettings } from "../../hooks/useSettings";
import { useParams } from "react-router-dom";
import profile_css from "../../css/profile.module.css";

export default function Blogs() {
	const { userData } = useAuthContext()!;
	const { data } = useSettings();
	const { user_id } = useParams();
	const { getProfileData, userProfileData, blogs } = useProfileData();

	useEffect(() => {
		if (user_id) {
			getProfileData(user_id);
		}
	}, [user_id]);

	return (
		<>
			<div className={profile_css.blogsSearchBar}>
				<input type="search" placeholder="Search by title" />
			</div>
		</>
	);
}
