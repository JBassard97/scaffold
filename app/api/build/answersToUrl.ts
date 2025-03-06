const answersToUrl = async (answers: any) => {
    console.log(answers);
    let url = ""

    if (answers.start === "frontend") {
        url += "frontend"

        if (answers.frontend === "framework") {
            if (answers["frontend-framework"] === "react") {
                url += "/react"

                switch (answers["react-variant"]) {
                    case "javascript":
                        url += "/javascript"
                        break;
                    case "javascript+swc":
                        url += "/javascript+swc"
                        break;
                    case "typescript":
                        url += "/typescript"
                        break;
                    case "typescript+swc":
                        url += "/typescript+swc"
                        break;
                    case "reactrouterv7":
                        url += "/reactrouterv7"
                        break;
                }
            }
        }
    }

    if (answers.start === "backend") {
        url += "backend"
    }

    if (answers.start === "fullstack") {
        url += "fullstack"
    }

    return url;
}

export default answersToUrl;