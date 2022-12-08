const [credentials, dispatchCredentials] = useReducer(
(state: CredentialsState, action: CredentialsAction) => {

        switch action.command{
            case "ss" :
                return {...state}
        }
      return { ...state };
    },
    { mode: { password: { username: "", password: "" } } }

);
