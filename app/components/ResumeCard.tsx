import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({
	resume: { resumePath, companyName, jobTitle, feedback, imagePath },
}: {
	resume: Resume;
}) => {
	return (
		<Link
			to={`/resume/${resumePath}`}
			className="resume-card animate-in fade-in duration-1000"
		>
			<div className="resume-card-header">
				<div className="flex flex-col gap-2">
					<div className="font-bold text-black! wrap-break-word">
						{companyName}
					</div>
					<h3 className="text-lg wrap-break-word text-gray-500">{jobTitle}</h3>
				</div>
				<div className="shrink-0">
					<ScoreCircle score={feedback.overallScore} />
				</div>
			</div>

			<div className="gradient-border animate-in fade-in duration-1000">
				<div className="size-full">
					<img
						src={imagePath}
						alt="resume"
						className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
					/>
				</div>
			</div>
		</Link>
	);
};

export default ResumeCard;
