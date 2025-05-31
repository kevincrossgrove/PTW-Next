import { twMerge } from "tailwind-merge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface Props {
  containerClass?: string;
  titleClass?: string;
  descriptionClass?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function AppAlert({
  title,
  description,
  containerClass,
  titleClass,
  descriptionClass,
  icon,
}: Props) {
  return (
    <Alert
      className={twMerge(
        "flex justify-center items-center font-medium",
        containerClass
      )}
    >
      {icon}
      {title && (
        <AlertTitle className={twMerge(titleClass)}>{title}</AlertTitle>
      )}
      {description && (
        <AlertDescription className={twMerge(descriptionClass)}>
          {description}
        </AlertDescription>
      )}
    </Alert>
  );
}
