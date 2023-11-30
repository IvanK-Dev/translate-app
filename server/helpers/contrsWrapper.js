const contrsWrapper = (contr) => {
    return async (res, req, next) => {
        try {
            await contr(res, req, next);
        } catch (error) {
            next(error);
        }
    };
};

export default contrsWrapper;
