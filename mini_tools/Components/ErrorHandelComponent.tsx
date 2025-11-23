"use client";
type ErrorHandelComponentProps = {
    error: string | null;
};

export default  function ErrorHandelComponent({error}: ErrorHandelComponentProps) {
    return (
        <div className="rounded-md border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
        </div>
    )
}