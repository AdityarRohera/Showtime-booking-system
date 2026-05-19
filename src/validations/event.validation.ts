// validations/event.validation.ts

export const validateCreateEvent = (
    data: any
) => {

    if (!data.title) {
        throw new Error("Title is required");
    }

    if (!data.eventType) {
        throw new Error("Event type is required");
    }

    if (!data.duration) {
        throw new Error("Duration is required");
    }

    if (!data.language) {
        throw new Error("Language is required");
    }

    if (
        !Array.isArray(data.castIds)
    ) {
        throw new Error(
            "castIds must be array"
        );
    }

    if (
        !Array.isArray(data.genresIds)
    ) {
        throw new Error(
            "genresIds must be array"
        );
    }
};