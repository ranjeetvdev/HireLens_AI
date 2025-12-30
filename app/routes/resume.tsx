import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
	{ title: "HireLens - Resume Analysis" },
	{
		name: "description",
		content:
			"Detailed analysis of your resume with AI-powered insights tailored to your job description.",
	},
];

const resume = () => {
	const { auth, isLoading, fs, kv } = usePuterStore();
	const { id } = useParams();
	const [resumeUrl, setResumeUrl] = useState<string | null>("");
	const [imageUrl, setImageUrl] = useState<string | null>("");
	const [feedback, setFeedback] = useState<Feedback | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (!auth.isAuthenticated && !isLoading)
			navigate("/auth?next=/resume/" + id);
	}, [auth.isAuthenticated, isLoading]);

	useEffect(() => {
		const loadResumeData = async () => {
			if (!id) return;
			try {
				const resumeData = await kv.get(`resume:${id}`);
				if (!resumeData) return;
				const { resumePath, imagePath, feedback } = JSON.parse(resumeData);

				const resumeBlob = await fs.read(resumePath);
				if (!resumeBlob) return;
				const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
				setResumeUrl(URL.createObjectURL(pdfBlob));

				const imageBlob = await fs.read(imagePath);
				if (!imageBlob) return;
				const imgBlob = new Blob([imageBlob], { type: "image/png" });
				setImageUrl(URL.createObjectURL(imgBlob));

				setFeedback(feedback);
				console.log({ resumeUrl, imageUrl, feedback });
			} catch (error) {
				console.error("Error fetching resume data:", error);
			}
		};

		loadResumeData();
	}, [id]);

	return (
		<main className="pt-0!">
			<nav className="resume-nav">
				<Link to="/" className="back-button">
					<img src="/icons/back.svg" alt="back button" className="size-2.5" />
					<span className="text-sm font-semibold text-gray-800">
						Back to Upload
					</span>
				</Link>
			</nav>
			<div className="flex flex-row w-full max-lg:flex-col-reverse">
				<section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-screen sticky top-0 items-center justify-center">
					{imageUrl && resumeUrl && (
						<div className="animate-in fade-in delay-1000 gradient-border max-sm:m-0 h-[90%] max-2xl:h-fit w-fit">
							<a href={resumeUrl} target="_blank" rel="noopener noreferrer">
								<img
									src={imageUrl}
									alt="Resume Preview"
									className="size-full object-contain rounded-2xl"
									title="Resume Preview"
								/>
							</a>
						</div>
					)}
				</section>

				<section className="feedback-section">
					<h2 className="text-4xl font-bold text-black!">Resume Review</h2>
					{feedback ? (
						<div className="flex flex-col gap-8 animate-in fade-in duration-1000">
							<Summary feedback={feedback} />
							<ATS
								score={feedback.ATS.score || 0}
								suggestions={feedback.ATS.tips || []}
							/>
							<Details feedback={feedback} />
						</div>
					) : (
						<img
							src="/images/resume-scan-2.gif"
							alt="loading feedback..."
							className="w-full"
						/>
					)}
				</section>
			</div>
		</main>
	);
};

export default resume;
