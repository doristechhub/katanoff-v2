import AppointmentForm from "@/components/ui/AppointmentForm";

export default function AppointmentCustomJewelryPage() {
  return (
    <>
      <section className="container pt-4 md:pt-8 lg:pt-12 2xl:pt-20">
        <div className="space-y-10 max-w-3xl mx-auto font-Figtree">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white font-medium">
              1
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-baseblack font-medium mb-2">
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
              <h3 className="text-xl md:text-2xl font-baseblack font-medium mb-2">
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
              <h3 className="text-xl md:text-2xl font-baseblack font-medium mb-2">
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
      <section>
        <div className="container py-12 md:py-16 lg:py-12 2xl:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="border border-gray-e2 p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-20 shadow-sm">
              <AppointmentForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
