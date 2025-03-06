import { NextResponse } from "next/server";
import archiver from "archiver";
import stream from "stream";
import answersToUrl from "./answersToUrl";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body.answers || typeof body.answers !== "object") {
            return NextResponse.json({ error: "'answers' is required and must be an object." }, { status: 400 });
        }

        const repoOwner = process.env.REPO_OWNER;
        const repoUrl = process.env.GITHUB_REPO;
        const templatePath = await answersToUrl(body.answers);

        const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoUrl}/contents/${templatePath}`;
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

        // Recursive function to fetch and add files
        async function addFilesToArchive(files: any[], currentPath = "") {
            for (const file of files) {
                const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;

                if (file.type === "file") {
                    const fileResponse = await fetch(file.download_url);
                    const fileContent = await fileResponse.text();
                    archive.append(fileContent, { name: filePath });
                } else if (file.type === "dir") {
                    // Fetch directory contents
                    const dirResponse = await fetch(file.url, {
                        headers: { Accept: "application/vnd.github.v3+json" },
                    });

                    if (!dirResponse.ok) {
                        throw new Error(`Failed to fetch directory: ${filePath}`);
                    }

                    const dirFiles = await dirResponse.json();
                    await addFilesToArchive(dirFiles, filePath); // Recursively fetch subdirectory files
                }
            }
        }

        await addFilesToArchive(files);

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
