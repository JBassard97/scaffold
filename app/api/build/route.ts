import { NextResponse } from "next/server";
import archiver from "archiver";
import stream from "stream";

export async function POST(req: Request) {
    try {
        const templatePath = "frontendreactjavascript"; // Example template folder
        const body = await req.json();

        if (!body.answers || typeof body.answers !== "object") {
            return NextResponse.json({ error: "'answers' is required and must be an object." }, { status: 400 });
        }

        const repoUrl = process.env.GITHUB_REPO;
        const githubApiUrl = `https://api.github.com/repos/jbassard97/${repoUrl}/contents/${templatePath}`;
        console.log("GitHub API URL:", githubApiUrl);
        const response = await fetch(githubApiUrl, {
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch template directory from GitHub");
        }

        const files = await response.json();
        const zipStream = new stream.PassThrough();
        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.pipe(zipStream);

        for (const file of files) {
            if (file.type === "file") {
                const fileResponse = await fetch(file.download_url);
                const fileContent = await fileResponse.text();
                archive.append(fileContent, { name: file.name });
            }
        }

        await archive.finalize();

        const readableStream = new ReadableStream({
            start(controller) {
                zipStream.on('data', chunk => controller.enqueue(chunk));
                zipStream.on('end', () => controller.close());
                zipStream.on('error', err => controller.error(err));
            }
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": "attachment; filename=project-template.zip",
            },
        });
    } catch (error) {
        console.error("Error processing build request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
