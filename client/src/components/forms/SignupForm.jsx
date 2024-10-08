import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";
import Auth from "../../utils/auth";

function SignupForm() {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    usernameMessage: "",
    emailMessage: "",
    passwordMessage: "",
    passwordConfirmMessage: "",
  });

  const [addUser] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    const validationMessages = {
      username: "Username is required",
      email: "Email is required",
      password: "Password is required",
      passwordConfirm: "Password confirmation is required",
    };

    // set the appropriate message
    setFormState({
      ...formState,
      [`${name}Message`]: value === "" ? validationMessages[name] : "",
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const { username, password, passwordConfirm } = formState;

    if (password !== passwordConfirm) {
      console.error("Passwords do not match");
      return false;
    }

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      if (data && data.createUser && data.createUser.token) {
        Auth.login(data.createUser.token);
      } else {
        console.error("Token not found in the response");
      }
    } catch (err) {
      // I used some stock error handling code from the Apollo docs to try and trace the error
      // we can probaby get rid of most of this
      console.error("Error during mutation:", err);
      if (err.networkError) {
        console.error("Network error details:", err.networkError.result.errors);
      }
      if (err.graphQLErrors) {
        err.graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(
            `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
    }

    // AFTER signing up, alert user and reset state
    alert(`Welcome, ${username}!`);
    setFormState({
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      usernameMessage: "",
      emailMessage: "",
      passwordMessage: "",
      passwordConfirmMessage: "",
    });
    // TODO: redirect to home or wherever
  };

  return (
    <form onSubmit={handleFormSubmit} className="narrow">
      <h2>Sign Up</h2>
      <input
        value={formState.username}
        name="username"
        onChange={handleInputChange}
        onBlur={handleBlur}
        type="text"
        placeholder="username"
        required
      />
      <p>{formState.usernameMessage}</p>

      <input
        value={formState.email}
        name="email"
        onChange={handleInputChange}
        onBlur={handleBlur}
        type="email"
        placeholder="email"
        required
      />
      <p>{formState.emailMessage}</p>

      <input
        value={formState.password}
        name="password"
        onChange={handleInputChange}
        onBlur={handleBlur}
        type="password"
        placeholder="password"
        required
      />
      <p>{formState.passwordMessage}</p>

      <input
        value={formState.passwordConfirm}
        name="passwordConfirm"
        onChange={handleInputChange}
        onBlur={handleBlur}
        type="password"
        placeholder="confirm password"
        required
      />
      <p>{formState.passwordConfirmMessage}</p>

      <button className="btn-1" type="submit">
        Submit
      </button>
    </form>
  );
};

export default SignupForm;