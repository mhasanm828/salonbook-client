import ServiceForm from "@/components/ServiceForm";

export default function AddServicePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Add New Service</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Create a salon service. The image must be uploaded (not a URL).
      </p>
      <div className="mt-6">
        <ServiceForm />
      </div>
    </div>
  );
}
