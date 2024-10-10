import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as Error;
 

  return (
    <div id="error-page" className="flex flex-col items-center 
    justify-center h-screen w-screen gap-[5%]">
      <h1 className="text-8xl">Oops!</h1>
      <p className="text-xl">Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
        {(error as Error)?.message ||
            (error as { statusText?: string })?.statusText}
        </i>
      </p>
    </div>
  );
}