import { ClientError, ServerError } from "type/error.type";

const errorHandler = (err) => {
  if (err.response) {
    const data = err.response.data;
    if (data && data.status < 500) {
      if (data.detail) {
        throw new ClientError(data.detail);
      }
    } else {
      throw new ServerError(data.message);
    }
  } else {
    throw new ServerError(err.message);
  }
};

export default errorHandler;
