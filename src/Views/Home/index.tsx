import SignInComponent from 'Components/SignIn';
import SignUpComponent from 'Components/SignUp';
export default function HomeView(): JSX.Element {
  return (
    <div>
      <SignInComponent />
      <SignUpComponent />
    </div>
  );
}
