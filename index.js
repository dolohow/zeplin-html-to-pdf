process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
const wkhtmltopdf = require("./utils/wkhtmltopdf");
const errorUtil = require("./utils/error");

exports.handler = function handler(event, context, callback) {
    console.log("Received event:", JSON.stringify(event, null, 2));

    if (!event.body) {
        const errorResponse = errorUtil.createErrorResponse(400, "Validation error: Missing body");
        callback(errorResponse);
        return;
    }

    const { html } = JSON.parse(event.body);

    if (!html) {
        const errorResponse = errorUtil.createErrorResponse(400, "Validation error: Missing html param");
        callback(errorResponse);
        return;
    }

    wkhtmltopdf(html)
        .then(buffer => {
            callback(null, {
                data: buffer.toString("base64")
            });
        }).catch(error => {
            callback(errorUtil.createErrorResponse(500, "Internal server error", error));
        });
};
