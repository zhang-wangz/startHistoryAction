import { D3Selection } from "../types"

export const drawTitle = (selection: D3Selection, text: string, logoURL: string, color: string, chartWidth: number, fontSize: number = 20) => {
    let logoX: string | number = "38%",
        clipX: string | number = "39.5%"
    if (selection.node()?.getBoundingClientRect()) {
        logoX = (selection.node()?.getBoundingClientRect().width as number) * 0.5 - 84
        clipX = (selection.node()?.getBoundingClientRect().width as number) * 0.5 - 73
    }
    if (chartWidth) {
        logoX = chartWidth * 0.5 - 84
        clipX = chartWidth * 0.5 - 73
    }

    selection
        .append("text")
        .style("font-size", `${fontSize}px`)
        .style("font-weight", "bold")
        .style("fill", color)
        .attr("x", "50%")
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .text(text)

    if (logoURL) {
        selection
            .append("svg")
            .append("defs")
            .append("clipPath")
            .attr("id", "clip-circle-title")
            .append("circle")
            .attr("r", 11)
            .attr("cx", clipX)
            .attr("cy", 12 + 11)

        selection
            .append("image")
            .attr("x", logoX)
            .attr("y", 12)
            .attr("height", 22)
            .attr("width", 22)
            .attr("href", logoURL)
            .attr("clip-path", "url(#clip-circle-title)")
    }
}

export const drawXLabel = (selection: D3Selection, text: string, color: string, fontSize: number = 16) => {
    selection
        .append("text")
        .style("font-size", `${fontSize}px`)
        .style("fill", color)
        .attr("x", "50%")
        .attr("y", selection.node()?.getBoundingClientRect().height as number - 6)
        .attr("text-anchor", "middle")
        .text(text)
}

export const drawYLabel = (selection: D3Selection, text: string, color: string, fontSize: number = 16) => {
    selection
        .append("text")
        .style("font-size", `${fontSize}px`)
        .style("fill", color)
        .attr("transform", "rotate(-90)")
        .attr("x", "-50%")
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .text(text)
}
