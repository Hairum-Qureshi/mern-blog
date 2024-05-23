import "../css/app.css";

interface AlertPopUpProps {
	children: React.ReactNode;
}

export default function AlertPopUp({ children }: AlertPopUpProps) {
	return <div className="alert">{children}</div>;
}
