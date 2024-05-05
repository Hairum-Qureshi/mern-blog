import modal_css from "../css/modal.module.css";

export default function ConfirmationModal(children: string) {
	return (
		<div className={modal_css.modal}>
			<div className={modal_css.modalContent}>
				<p>{children}</p>
			</div>
		</div>
	);
}
