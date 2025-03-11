const answersToUrl = async (answers: any) => {
    let url = ""

    if (answers.start === "frontend") {
        url += "frontend"

        if (answers.frontend === "framework") {
            if (answers["frontend-use-vite"]) {
                url += "/vite"
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

                if (answers["frontend-framework"] === "vue") {
                    url += "/vue"

                    if (answers["vue-variant"] === "javascript") {
                        url += "/javascript"
                    }

                    if (answers["vue-variant"] === "typescript") {
                        url += "/typescript"
                    }
                }
            } else {
                url += "/scaffold"
            }

            if (answers.start === "backend") {
                url += "backend"
            }

            if (answers.start === "fullstack") {
                url += "fullstack"
            }
        }
    }
    return url;
}

export default answersToUrl;