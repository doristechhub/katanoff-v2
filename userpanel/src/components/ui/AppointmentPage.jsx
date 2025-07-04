import AppointmentForm from "@/components/ui/AppointmentForm";
import KeyFeatures from "@/components/ui/KeyFeatures";

export default function AppointmentPage() {
  return (
    <div className="pt-10">
      <section className="container  p-8 md:p-8 lg:p-12 2xl:p-20">
        <div className="space-y-10 max-w-3xl mx-auto font-Figtree">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white font-medium">
              1
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-baseblack font-semibold mb-2">
                Complete the Appointment Form
              </h3>
              <p className="text-baseblack">
                Please fill out all required fields in the form, including your
                contact details, preferred date, time, and any additional
                information.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white font-medium">
              2
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-baseblack font-semibold mb-2">
                Approval Process
              </h3>
              <p className="text-baseblack">
                Once submitted, your appointment request will be reviewed by the
                admin or the business owner. You will receive confirmation or
                rejection of your request within 24-48 hours.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white font-medium">
              3
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-baseblack font-semibold mb-2">
                Notification
              </h3>
              <p className="text-baseblack">
                After the review, you will receive an email confirming your
                appointment or notifying you of any changes.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="container">
        <div>
          <div className="max-w-3xl mx-auto">
            <AppointmentForm />
          </div>
        </div>
      </section>
      <section className="container p-8 lg:p-16 2xl:p-18 mt-12">
        <KeyFeatures />
      </section>
    </div>
  );
}
