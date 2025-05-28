const ErrorMessage = ({ message = "", className = "" }) => {
  return message ? (
    <p className={`text-red-500 text-sm lg:text-base mt-1 ${className}`}>
      {message}
    </p>
  ) : null;
};

export default ErrorMessage;
