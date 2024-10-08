import { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { LOGIN_USER } from "../../utils/mutations"

function LoginForm() {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
    usernameMessage: "",
    passwordMessage: "",
  });

  const [login] = useMutation(LOGIN_USER);

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
      password: "Password is required",
    };

    // set the appropriate message
    setFormState({
      ...formState,
      [`${name}Message`]: value === "" ? validationMessages[name] : "",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formState;

    try {
      const { data } = await login({
        variables: { username, password },
      });
      Auth.login(data.login.token);
    } catch (err) {
      console.log(err);
    }
    if (Auth.isLoggedIn()) {
      alert(`Welcome, ${username}!`);
    } else {
      alert("Login failed. Please try again.");
      setFormState({
        username: "",
        password: "",
        usernameMessage: "",
        passwordMessage: "",
      });
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="narrow">
      <h2>Log in</h2>
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
        value={formState.password}
        name="password"
        onChange={handleInputChange}
        onBlur={handleBlur}
        type="password"
        placeholder="password"
        required
      />
      <p>{formState.passwordMessage}</p>

      <button className="btn-1" type="submit">
        Submit
      </button>
    </form>
  );
}

export default LoginForm;