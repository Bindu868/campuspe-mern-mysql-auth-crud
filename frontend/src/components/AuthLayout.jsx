import { Link } from 'react-router-dom';

const AuthLayout = ({ title, subtitle, children, footerText, footerLink, footerLabel }) => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-6 shadow-soft sm:p-10">
        <div className="mx-auto max-w-md">
          <h2 className="text-3xl font-bold text-ink">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-sm text-slate-500">
            {footerText}{' '}
            <Link className="font-semibold text-brand-700 hover:text-brand-600" to={footerLink}>
              {footerLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
