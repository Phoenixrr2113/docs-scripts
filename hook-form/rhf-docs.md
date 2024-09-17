

Page URL: https://www.react-hook-form.com/api/useform/

# useForm
React hooks for form validation
#### Menu
## useForm: UseFormProps
useForm is a custom hook for managing forms with ease. It takes one object as optional argument. The following example demonstrates all of its properties along with their default values.
Generic props:
Validation strategy before submitting behaviour.
Validation strategy after submitting behaviour.
Default values for the form.
Reactive values to update the form values.
Option to reset form state update while updating new form values.
Display all validation errors or one at a time.
Enable or disable built-in focus management.
Delay error from appearing instantly.
Use browser built-in form constraint API.
Enable and disable input unregister after unmount.
Schema validation props:
Integrates with your preferred schema validation library.
A context object to supply for your schema validation.
## Props
##### mode: onChange | onBlur | onSubmit | onTouched | all = 'onSubmit'!React Native: compatible with Controller
This option allows you to configure the validation strategy before a user submits the form. The validation occurs during the onSubmit event, which is triggered by invoking the handleSubmit function.
Validation is initially triggered on the first blur event. After that, it is triggered on every change event.
Note: when using with Controller, make sure to wire up onBlur with the render prop.
##### reValidateMode: onChange | onBlur | onSubmit = 'onChange'!React Native: Custom register or using Controller
This option allows you to configure validation strategy when inputs with errors get re-validated after a user submits the form (onSubmit event and handleSubmit function executed). By default, re-validation occurs during the input change event.
##### defaultValues: FieldValues | Promise<FieldValues>
The defaultValues prop populates the entire form with default values. It supports both synchronous and asynchronous assignment of default values. While you can set an input's default value using defaultValue or defaultChecked (as detailed in the official React documentation), it is recommended to use defaultValues for the entire form.
```javascript
// set default value sync
useForm({
  defaultValues: {
    firstName: '',
    lastName: ''
  }
})

// set default value async
useForm({
  defaultValues: async () =&gt; fetch('/api-endpoint');
})
```
### Rules
You should avoid providing undefined as a default value, as it conflicts with the default state of a controlled component.
defaultValues are cached. To reset them, use the reset API.
defaultValues will be included in the submission result by default.
It's recommended to avoid using custom objects containing prototype methods, such as Moment or Luxon, as defaultValues.
There are other options for including form data:
```javascript
// include hidden input
&lt;input {...register("hidden")} type="hidden" /&gt;
register("hidden", { value: "data" })

// include data onSubmit
const onSubmit = (data) =&gt; {
  const output = {
    ...data,
    others: "others"
  }
}

```
##### values: FieldValues
The values props will react to changes and update the form values, which is useful when your form needs to be updated by external state or server data.
```javascript
// set default value sync
function App({ values }) {
  useForm({
    values  // will get updated when values props updates       
  })
}

function App() {
  const values = useFetch('/api');
  
  useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    values, // will get updated once values returns
  })
}

```
##### resetOptions: KeepStateOptions
This property is related to value update behaviors. When values or defaultValues are updated, the reset API is invoked internally. It's important to specify the desired behavior after values or defaultValues are asynchronously updated. The configuration option itself is a reference to the reset method's options.
```javascript
// by default asynchronously value or defaultValues update will reset the form values
useForm({ values })
useForm({ defaultValues: async () =&gt; await fetch() })

// options to config the behaviour
// eg: I want to keep user interacted/dirty value and not remove any user errors
useForm({
  values,
  resetOptions: {
    keepDirtyValues: true, // user-interacted input will be retained
    keepErrors: true, // input errors will be retained with value update
  }
})

```
##### context: object
This context object is mutable and will be injected into the resolver's second argument or Yup validation's context object.
##### criteriaMode: firstError | all
When set to firstError (default), only the first error from each field will be gathered.
When set to all, all errors from each field will be gathered.
##### shouldFocusError: boolean = true
When set to true (default), and the user submits a form that fails validation, focus is set on the first field with an error.
Note: only registered fields with a ref will work. Custom registered inputs do not apply. For example: register('test') // doesn't work 
Note: the focus order is based on the register order.
##### delayError: number
This configuration delays the display of error states to the end-user by a specified number of milliseconds. If the user corrects the error input, the error is removed instantly, and the delay is not applied.
##### shouldUnregister: boolean = false
By default, an input value will be retained when input is removed. However, you can set shouldUnregister to true to unregister input during unmount.
This is a global configuration that overrides child-level configurations. To have individual behavior, set the configuration at the component or hook level, not at useForm.
By default, shouldUnregister: false means unmounted fields are not validated by built-in validation.
By setting shouldUnregister to true at useForm level, defaultValues will not be merged against submission result.
Setting shouldUnregister: true makes your form behave more closely to native forms.
Form values are stored within the inputs themselves.
Unmounting an input removes its value.
Hidden inputs should use the hidden attribute for storing hidden data.
Only registered inputs are included as submission data.
Unmounted inputs must be notified at either useForm or useWatch's useEffect for the hook form to verify that the input is unmounted from the DOM.
```javascript
const NotWork = () =&gt; {
  const [show, setShow] = React.useState(false);
  // ❌ won't get notified, need to invoke unregister
  return {show &amp;&amp; &lt;input {...register('test')} /&gt;}
}

const Work = ({ control }) =&gt; {
  const { show } = useWatch({ control })
  // ✅ get notified at useEffect
  return {show &amp;&amp; &lt;input {...register('test1')} /&gt;}
}

const App = () =&gt; {
  const [show, setShow] = React.useState(false);
  const { control } = useForm({ shouldUnregister: true });
  return (
    &lt;div&gt;
      // ✅ get notified at useForm's useEffect
      {show &amp;&amp; &lt;input {...register('test2')} /&gt;}
      &lt;NotWork /&gt;
      &lt;Work control={control} /&gt;
    &lt;/div&gt;
  )
}

```
##### shouldUseNativeValidation: boolean = false
This config will enable browser native validation. It will also enable CSS selectors :valid and:invalid making styling inputs easier. You can still use these selectors even when client-side validation is disabled.
Only works with onSubmit and onChange modes, as the reportValidity execution will focus the error input.
Each registered field's validation message is required to be string to display them natively.
This feature only works with the register API anduseController/Controller that are connected with actual DOM references.
### Examples
```javascript
import { useForm } from "react-hook-form";

export default function App() {
  const { register, handleSubmit } = useForm({ shouldUseNativeValidation: true });
  const onSubmit = async data =&gt; { console.log(data); };

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input
        {...register("firstName", { required: "Please enter your first name." })} // custom message
      /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
##### resolver: Resolver
This function allows you to use any external validation library such as Yup, Zod, Joi, Vest, Ajv and many others. The goal is to make sure you can seamlessly integrate whichever validation library you prefer. If you're not using a library, you can always write your own logic to validate your forms.
### Props
values
This object contains the entire form values.
context
This is the context object which you can provide to the useForm config. It is a mutable object that can be changed on each re-render.
options 
This is the option object containing information about the validated fields, names and criteriaMode from useForm.
### Rules
Schema validation focuses on field-level error reporting. Parent-level error checking is limited to the direct parent level, which is applicable for components such as group checkboxes.
This function will be cached.
Re-validation of an input will only occur one field at time during a user’s interaction. The lib itself will evaluate the error object to trigger a re-render accordingly.
A resolver can not be used with the built-in validators (e.g.: required, min, etc.)
When building a custom resolver:
Make sure that you return an object with both values and errors properties. Their default values should be an empty object. For example: {}.
The keys of the error object should match the name values of your fields.
### Examples
```javascript
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().required(),
}).required();

const App = () =&gt; {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    &lt;form onSubmit={handleSubmit(d =&gt; console.log(d))}&gt;
      &lt;input {...register("name")} /&gt;
      &lt;input type="number" {...register("age")} /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

type Inputs = {
  name: string;
  age: string;
};

const schema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().required(),
}).required();

const App = () =&gt; {
  const { register, handleSubmit } = useForm&lt;Inputs&gt;({
    resolver: yupResolver(schema), // yup, joi and even your own.
  });

  return (
    &lt;form onSubmit={handleSubmit(d =&gt; console.log(d))}&gt;
      &lt;input {...register("name")} /&gt;
      &lt;input type="number" {...register("age")} /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};
```
```javascript
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number()
});

const App = () =&gt; {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema)
  });

  return (
    &lt;form onSubmit={handleSubmit(d =&gt; console.log(d))}&gt;
      &lt;input {...register("name")} /&gt;
      &lt;input {...register("age", { valueAsNumber: true })} type="number" /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number()
});

type Schema = z.infer&lt;typeof schema&gt;;

const App = () =&gt; {
  const { register, handleSubmit } = useForm&lt;Schema&gt;({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: Schema) =&gt; {
    console.log(data);
  };

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("name")} /&gt;
      &lt;input {...register("age", { valueAsNumber: true })} type="number" /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};

```
```javascript
import React from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required(),
  age: Joi.string().required(),
});

const App = () =&gt; {
  const { register, handleSubmit } = useForm({
    resolver: joiResolver(schema),
  });

  return (
    &lt;form onSubmit={handleSubmit(d =&gt; console.log(d))}&gt;
      &lt;input {...register("name")} /&gt;
      &lt;input type="number" {...register("age")} /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};
import React from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

interface IFormInput {
  name: string;
  age: number;
}

const schema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required()
});

const App = () =&gt; {
  const { register, handleSubmit, formState: { errors } } = useForm&lt;IFormInput&gt;({
    resolver: joiResolver(schema)
  });
  const onSubmit = (data: IFormInput) =&gt; {
    console.log(data);
  };

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("name"} /&gt;
      &lt;input type="number" {...register("age"} /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
```javascript
import { useForm } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';

// must use `minLength: 1` to implement required field
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    password: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'password field is required' },
    },
  },
  required: ['username', 'password'],
  additionalProperties: false,
};

const App = () =&gt; {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: ajvResolver(schema),
  });

  return (
    &lt;form onSubmit={handleSubmit((data) =&gt; console.log(data))}&gt;
      &lt;input {...register('username')} /&gt;
      {errors.username &amp;&amp; &lt;p&gt;{errors.username.message}&lt;/p&gt;}
      &lt;input {...register('password')} /&gt;
      {errors.password &amp;&amp; &lt;p&gt;{errors.password.message}&lt;/p&gt;}
      &lt;button type="submit"&gt;submit&lt;/button&gt;
    &lt;/form&gt;
  );
};

```
```javascript
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { vestResolver } from '@hookform/resolvers/vest';
import vest, { test, enforce } from 'vest';

const validationSuite = vest.create((data = {}) =&gt; {
  test('username', 'Username is required', () =&gt; {
    enforce(data.username).isNotEmpty();
  });

  test('username', 'Must be longer than 3 chars', () =&gt; {
    enforce(data.username).longerThan(3);
  });

  test('password', 'Password is required', () =&gt; {
    enforce(data.password).isNotEmpty();
  });

  test('password', 'Password must be at least 5 chars', () =&gt; {
    enforce(data.password).longerThanOrEquals(5);
  });

  test('password', 'Password must contain a digit', () =&gt; {
    enforce(data.password).matches(/[0-9]/);
  });

  test('password', 'Password must contain a symbol', () =&gt; {
    enforce(data.password).matches(/[^A-Za-z0-9]/);
  });
});

const App = () =&gt; {
  const { register, handleSubmit } = useForm({
    resolver: vestResolver(validationSuite),
  });

  return (
    &lt;form onSubmit={handleSubmit((data) =&gt; console.log(data))}&gt;
      &lt;input {...register("username")} /&gt;
      &lt;input {...register("password")} /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};

```
```javascript
import * as React from "react";
import { useForm } from "react-hook-form";
import * as Joi from "joi";

const validationSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
});

const App = () =&gt; {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    context: "context",
    resolver: async (data, context) =&gt; {
      const { error, value: values } = validationSchema.validate(data, {
        abortEarly: false,
      });

      if (!error) return { values: values, errors: {} };

      return {
        values: {},
        errors: error.details.reduce(
          (previous, currentError) =&gt; ({
            ...previous,
            [currentError.path[0]]: currentError,
          }),
          {},
        ),
      };
    },
  });

  const onSubmit = data =&gt; {
    console.log(data)
  };

  return (
    &lt;div className="App"&gt;
      &lt;h1&gt;resolver&lt;/h1&gt;
      
      &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
        &lt;label&gt;Username&lt;/label&gt;
        &lt;input {...register("username")} /&gt;
        {errors.username &amp;&amp; &lt;p&gt;errors.username.message&lt;/p&gt;}
        &lt;input type="submit" /&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  );
};
import * as React from "react";
import { useForm } from "react-hook-form";
import * as Joi from "joi";

interface IFormInputs {
  username: string;
}

const validationSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
});

const App = () =&gt; {
  const { register, handleSubmit, formState: { errors } } = useForm&lt;IFormInputs&gt;({
    resolver: async data =&gt; {
      const { error, value: values } = validationSchema.validate(data, {
        abortEarly: false
      });

      return {
        values: error ? {} : values,
        errors: error
          ? error.details.reduce((previous, currentError) =&gt; {
              return {
                ...previous,
                [currentError.path[0]]: currentError
              };
            }, {})
          : {}
      };
    }
  });

  const onSubmit = (data: IFormInputs) =&gt; console.log(data);

  return (
    &lt;div className="App"&gt;
      &lt;h1&gt;resolver&lt;/h1&gt;

      &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
        &lt;label&gt;Username&lt;/label&gt;
        &lt;input {...register("username")} /&gt;
        {errors.username &amp;&amp; &lt;p&gt;errors.username.message&lt;/p&gt;}
        &lt;input type="submit" /&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  );
};

```
Need more? See Resolver Documentation
### Tip
You can debug your schema via the following code snippet:
```javascript
resolver: async (data, context, options) =&gt; {
  // you can debug your validation schema here
  console.log('formData', data)
  console.log('validation result', await anyResolver(schema)(data, context, options))
  return anyResolver(schema)(data, context, options)
},
```
## Return
The following list contains reference to useForm return props.
register
unregister
formState
watch
handleSubmit
reset
resetField
setError
clearErrors
setValue
setFocus
getValues
getFieldState
trigger
control
Form
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/register/

# register
Register uncontrolled/controlled inputs
#### Menu
## register: (name: string, RegisterOptions?) => ({ onChange, onBlur, name, ref })
This method allows you to register an input or select element and apply validation rules to React Hook Form. Validation rules are all based on the HTML standard and also allow for custom validation methods.
By invoking the register function and supplying an input's name, you will receive the following methods:
## Props
onChange prop to subscribe the input change event.
onBlur prop to subscribe the input blur event.
Input reference for hook form to register.
Input's name being registered.
## Return
Tip:: What's happened to the input after invoke register API:
```javascript
const { onChange, onBlur, name, ref } = register('firstName'); 
// include type check against field path with the name you have supplied.
        
&lt;input 
  onChange={onChange} // assign onChange event 
  onBlur={onBlur} // assign onBlur event
  name={name} // assign name prop
  ref={ref} // assign ref prop
/&gt;
// same as above
&lt;input {...register('firstName')} /&gt;

```
## Options
By selecting the register option, the API table below will get updated.
```javascript
&lt;input {...register("test")} /&gt;
```
A Boolean which, if true, indicates that the input must have a value before the form can be submitted. You can assign a string to return an error message in the errors object.
Note: This config aligns with web constrained API for required input validation, for object or array type of input use validate function instead.
```javascript
&lt;input
  {...register("test", {
    required: true
  })}
/&gt;
```
```javascript
&lt;input
  {...register("test", {
      maxLength: 2
  })}
/&gt;
```
```javascript
&lt;input
  {...register("test", {
    minLength: 1
  })}
/&gt;
```
```javascript
&lt;input
  type="number"
  {...register('test', {
    max: 3
  })}
/&gt;
```
```javascript
&lt;input
  type="number"
  {...register("test", {
    min: 3
  })}
/&gt;
```
The regex pattern for the input.
Note: A RegExp object with the /g flag keeps track of the lastIndex where a match occurred.
```javascript
&lt;input
  {...register("test", {
    pattern: /[A-Za-z]{3}/
  })}
/&gt;
```
You can pass a callback function as the argument to validate, or you can pass an object of callback functions to validate all of them. This function will be executed on its own without depending on other validation rules included in the required attribute.
Note: for object or array input data, it's recommended to use the validate function for validation as the other rules mostly apply to string, string[], number and boolean data types.
```javascript
&lt;input
  {...register("test", {
    validate: (value, formValues) =&gt; value === '1'
  })}
/&gt;
// object of callback functions
&lt;input
  {...register("test1", {
    validate: {
      positive: v =&gt; parseInt(v) &gt; 0,
      lessThanTen: v =&gt; parseInt(v) &lt; 10,
      validateNumber: (_, values) =&gt;
        !!(values.number1 + values.number2), 
      checkUrl: async () =&gt; await fetch(),
    }
  })}
/&gt;

```
Returns a Number normally. If something goes wrong NaN will be returned.
valueAs process is happening before validation.
Only applicable and support to <input type="number" />, but we still cast to number type without trim or any other data manipulation.
```javascript
&lt;input
  type="number"
  {...register("test", {
    valueAsNumber: true,
  })}
/&gt;
```
Returns a Date object normally. If something goes wrong Invalid Date will be returned.
valueAs process is happening before validation.
Only applies to <input />.
```javascript
&lt;input
  type="date"
  {...register("test", {
    valueAsDate: true,
  })}
/&gt;
```
Return input value by running through the function.
valueAs process is happening before validation. Also, setValueAs is ignored if either valueAsNumber or valueAsDate are true.
Only applies to text input.
```javascript
&lt;input
  type="number"
  {...register("test", {
    setValueAs: v =&gt; parseInt(v),
  })}
/&gt;
```
Set disabled to true will lead input value to be undefined and input control to be disabled.
Disabled prop will also omit built-in validation rules.
For schema validation, you can leverage the undefined value returned from input or context object.
```javascript
&lt;input
  {...register("test", {
    disabled: true
  })}
/&gt;
```
onChange function event to be invoked in the change event.
```javascript
register('firstName', {
  onChange: (e) =&gt; console.log(e)
})
```
onBlur function event to be invoked in the blur event.
```javascript
register('firstName', {
  onBlur: (e) =&gt; console.log(e)
})
```
Set up value for the registered input. This prop should be utilised inside useEffect or invoke once, each re-run will update or overwrite the input value which you have supplied.
```javascript
register('firstName', { value: 'bill' })
```
Input will be unregistered after unmount and defaultValues will be removed as well.
Note: this prop should be avoided when using with useFieldArray as unregister function gets called after input unmount/remount and reorder.
```javascript
&lt;input
  {...register("test", {
    shouldUnregister: true,
  })}
/&gt;
```
Validation will be triggered for the dependent inputs,it only limited to register api not trigger.
```javascript
&lt;input
  {...register("test", {
    deps: ['inputA', 'inputB'],
  })}
/&gt;
```
## Rules
name is required and unique (except native radio and checkbox). Input name supports both dot and bracket syntax, which allows you to easily create nested form fields.
name can neither start with a number nor use number as key name. Please avoid special characters as well.
we are using dot syntax only for typescript usage consistency, so bracket [] will not work for array form value.
```javascript
register('test.0.firstName'); // ✅
register('test[0]firstName'); // ❌
```
disabled input will result in an undefined form value. If you want to prevent users from updating the input, you can use readOnly or disable the entire <fieldset />. Here is an example.
To produce an array of fields, input names should be followed by a dot and number. For example: test.0.data
Changing the name on each render will result in new inputs being registered. It's recommend to keep static names for each registered input.
Input value and reference will no longer gets removed based on unmount. You can invoke unregister to remove that value and reference.
Individual register option can't be removed by undefined or {}. You can update individual attribute instead.
```javascript
register('test', { required: true });
register('test', {}); // ❌
register('test', undefined); // ❌
register('test', { required: false });  // ✅

```
There are certain keyword which need to avoid before conflicting with type check. They are ref, _f
## Examples
```javascript
import * as React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      category: '',
      checkbox: [],
      radio: ''
    }
  });

  return (
    &lt;form onSubmit={handleSubmit(console.log)}&gt;
      &lt;input {...register("firstName", { required: true })} placeholder="First name" /&gt;

      &lt;input {...register("lastName", { minLength: 2 })} placeholder="Last name" /&gt;

      &lt;select {...register("category")}&gt;
        &lt;option value=""&gt;Select...&lt;/option&gt;
        &lt;option value="A"&gt;Category A&lt;/option&gt;
        &lt;option value="B"&gt;Category B&lt;/option&gt;
      &lt;/select&gt;
      
      &lt;input {...register("checkbox")} type="checkbox" value="A" /&gt;
      &lt;input {...register("checkbox")} type="checkbox" value="B" /&gt;
      &lt;input {...register("checkbox")} type="checkbox" value="C" /&gt;
      
      &lt;input {...register("radio")} type="radio" value="A" /&gt;
      &lt;input {...register("radio")} type="radio" value="B" /&gt;
      &lt;input {...register("radio")} type="radio" value="C" /&gt;

      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}
import * as React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) =&gt; alert(JSON.stringify(data));

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("firstName")} placeholder="First name" /&gt;

      &lt;input {...register("lastName")} placeholder="Last name" /&gt;

      &lt;select {...register("category")}&gt;
        &lt;option value=""&gt;Select...&lt;/option&gt;
        &lt;option value="A"&gt;Category A&lt;/option&gt;
        &lt;option value="B"&gt;Category B&lt;/option&gt;
      &lt;/select&gt;

      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
## Video
The following video explain register API in detail.
## Tips
#### Custom Register
You can also register inputs with useEffect and treat them as virtual inputs. For controlled components, we provide a custom hook useController and Controller component to take care this process for you.
If you choose to manually register fields, you will need to update the input value with setValue.
```javascript
register('firstName', { required: true, min: 8 });

&lt;TextInput onTextChange={(value) =&gt; setValue('lastChange', value))} /&gt;

```
#### How to work with innerRef, inputRef?
When the custom input component didn't expose ref correctly, you can get it working via the following.
```javascript
// not working, because ref is not assigned
&lt;TextInput {...register('test')} /&gt;

const firstName = register('firstName', { required: true })
&lt;TextInput
  name={firstName.name}
  onChange={firstName.onChange}
  onBlur={firstName.onBlur}
  inputRef={firstName.ref} // you can achieve the same for different ref name such as innerRef
/&gt;

// correct way to forward input's ref
const Select = React.forwardRef(({ onChange, onBlur, name, label }, ref) =&gt; (
  &lt;select name={name} ref={ref} onChange={onChange} onBlur={onBlur}&gt;
    &lt;option value="20"&gt;20&lt;/option&gt;
    &lt;option value="30"&gt;30&lt;/option&gt;
  &lt;/select&gt;
));

```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/unregister/

# unregister
Unregister uncontrolled/controlled inputs
#### Menu
## unregister: (name: string | string[], options) => void
This method allows you to unregister a single input or an array of inputs. It also provides a second optional argument to keep state after unregistering an input.
## Props
The example below shows what to expect when you invoke the unregister method.
```javascript
&lt;input {...register('yourDetails.firstName')} /&gt;
&lt;input {...register('yourDetails.lastName')} /&gt;

```
## Options
isDirty and dirtyFields will be remained during this action. However, this is not going to guarantee the next user input will not update isDirty formState, because isDirty is measured against the defaultValues.
```javascript
unregister('test',
  { keepDirty: true }
)
```
touchedFields will no longer remove that input after unregister.
```javascript
unregister('test',
  { keepTouched: true }
)
```
isValid will be remained during this action. However, this is not going to guarantee the next user input will not update isValid for schema validation, you will have to adjust the schema according with the unregister.
```javascript
unregister('test',
  { keepIsValid: true }
)
```
```javascript
unregister('test',
  { keepError: true }
)
```
```javascript
unregister('test',
  { keepValue: true }
)
```
```javascript
unregister('test',
  { keepDefaultValue: true }
)
```
## Rules
This method will remove input reference and its value, which means built-in validation rules will be removed as well.
By unregister an input, it will not affect the schema validation.
```javascript
const schema = yup.object().shape({
  firstName: yup.string().required()
}).required();

unregister("firstName"); // this will not remove the validation against firstName input

```
Make sure you unmount that input which has register callback or else the input will get registered again.
```javascript
const [show, setShow] = React.useState(true)

const onClick = () =&gt; {
  unregister('test');
  setShow(false); // make sure to unmount that input so register not invoked again.
}

{show &amp;&amp; &lt;input {...register('test')} /&gt;}
```
## Examples
```javascript
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const { register, handleSubmit, unregister } = useForm();
  
  React.useEffect(() =&gt; {
    register("lastName");
  }, [register])

  return (
    &lt;form&gt;
      &lt;button type="button" onClick={() =&gt; unregister("lastName")}&gt;unregister&lt;/button&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface IFormInputs {
  firstName: string;
  lastName?: string;
}

export default function App() {
  const { register, handleSubmit, unregister } = useForm&lt;IFormInputs&gt;();
  const onSubmit = (data: IFormInputs) =&gt; console.log(data);

  React.useEffect(() =&gt; {
    register("lastName");
  }, [register])

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;button type="button" onClick={() =&gt; unregister("lastName")}&gt;unregister&lt;/button&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};


```
## Video
The following video explain unregister API in detail.
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/formstate/

# formState
State of the form
#### Menu
## formState: Object
This object contains information about the entire form state. It helps you to keep on track with the user's interaction with your form application.
## Return
Set to true after the user modifies any of the inputs.
Important: Make sure to provide all inputs' defaultValues at the useForm, so hook form can have a single source of truth to compare whether the form is dirty.
```javascript
const {
  formState: { isDirty, dirtyFields },
  setValue,
} = useForm({ defaultValues: { test: "" } });

// isDirty: true
setValue('test', 'change')
 
// isDirty: false because there getValues() === defaultValues
setValue('test', '') 

```
File typed input will need to be managed at the app level due to the ability to cancel file selection and FileList object.
An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues.
Important: Make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness.
Dirty fields will not represent as isDirty formState, because dirty fields are marked field dirty at field level rather the entire form. If you want to determine the entire form state use isDirty instead.
The value which has been set at useForm's defaultValues or updated defaultValues via reset API.
Indicate the form was successfully submitted without any runtime error.
true if the form is currently loading async default values.
Important: this prop is only applicable to async defaultValues
```javascript
const { 
  formState: { isLoading } 
} = useForm({ 
  defaultValues: async () =&gt; await fetch('/api') 
});

```
setError has no effect on isValid formState, isValid will always derived via the entire form validation result.
## Rules
formState is wrapped with a Proxy to improve render performance and skip extra logic if specific state is not subscribed to. Therefore make sure you invoke or read it before a render in order to enable the state update.
formState is updated in batch. If you want to subscribe to formState via useEffect, make sure that you place the entire formState in the optional array.
```javascript
useEffect(() =&gt; {
  if (formState.errors.firstName) {
    // do the your logic here
  }
}, [formState]); // ✅ 
// ❌ formState.errors will not trigger the useEffect        

```
```javascript
import { useForm } from "react-hook-form";

export default function App () {
  const {
    register,
    handleSubmit,
    formState
  } = useForm();

  const onSubmit = (data) =&gt; console.log(data);

  React.useEffect(() =&gt; {
    console.log("touchedFields", formState.touchedFields);
  },[formState]); // use entire formState object as optional array arg in useEffect, not individual properties of it


  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("test")} /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};

import React from "react";
import { useForm } from "react-hook-form";
type FormInputs = {
  test: string
}
export default function App() {
  const {
    register,
    handleSubmit,
    formState
  } = useForm&lt;FormInputs&gt;();
  const onSubmit = (data: FormInputs) =&gt; console.log(data);
  
  React.useEffect(() =&gt; {
    console.log("touchedFields", formState.touchedFields);
  }, [formState]);
  
  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("test")} /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
Pay attention to the logical operator when subscription to formState.
```javascript
// ❌ formState.isValid is accessed conditionally, 
// so the Proxy does not subscribe to changes of that state
return &lt;button disabled={!formState.isDirty || !formState.isValid} /&gt;;
  
// ✅ read all formState values to subscribe to changes
const { isDirty, isValid } = formState;
return &lt;button disabled={!isDirty || !isValid} /&gt;;

```
## Examples
```javascript
import React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const {
    register,
    handleSubmit,
    // Read the formState before render to subscribe the form state through the Proxy
    formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
  } = useForm();
  const onSubmit = (data) =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("test")} /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}
import { useForm } from "react-hook-form";

type FormInputs = {
  test: string
}

export default function App() {
  const {
    register,
    handleSubmit,
    // Read the formState before render to subscribe the form state through Proxy
    formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
  } = useForm&lt;FormInputs&gt;();
  const onSubmit = (data: FormInputs) =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("test")} /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
## Video
The following video will explain in detail different form states.
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/watch/

# watch
Subscribe to input changes
#### Menu
## watch: (names?: string | string[] | (data, options) => void) => unknown
This method will watch specified inputs and return their values. It is useful to render input value and for determining what to render by condition.
## Props
## Return
## Rules
When defaultValue is not defined, the first render of watch will return undefined because it is called before register. It's recommend to provide defaultValues at useForm to avoid this behaviour, but you can set the inline defaultValue as the second argument.
When both defaultValue and defaultValues are supplied, defaultValue will be returned.
This API will trigger re-render at the root of your app or form, consider using a callback or the useWatch api if you are experiencing performance issues.
watch result is optimised for render phase instead of useEffect's deps, to detect value update you may want to use an external custom hook for value comparison.
## Examples
```javascript
import React from "react";
import { useForm } from "react-hook-form";

function App() {
  const { register, watch, formState: { errors }, handleSubmit } = useForm();
  const watchShowAge = watch("showAge", false); // you can supply default value as second argument
  const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
  const watchFields = watch(["showAge", "number"]); // you can also target specific fields by their names

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  React.useEffect(() =&gt; {
    const subscription = watch((value, { name, type }) =&gt; console.log(value, name, type));
    return () =&gt; subscription.unsubscribe();
  }, [watch]);

  const onSubmit = data =&gt; console.log(data);

  return (
    &lt;&gt;
      &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
        &lt;input type="checkbox" {...register("showAge")} /&gt;
        
        {/* based on yes selection to display Age Input*/}
        {watchShowAge &amp;&amp; &lt;input type="number" {...register("age", { min: 50 })} /&gt;}
        
        &lt;input type="submit" /&gt;
      &lt;/form&gt;
    &lt;/&gt;
  );
}
import React from "react";
import { useForm } from "react-hook-form";

interface IFormInputs {
  name: string
  showAge: boolean
  age: number
}

function App() {
  const { register, watch, formState: { errors }, handleSubmit } = useForm&lt;IFormInputs&gt;();
  const watchShowAge = watch("showAge", false); // you can supply default value as second argument
  const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
  const watchFields = watch(["showAge", "age"]); // you can also target specific fields by their names

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  React.useEffect(() =&gt; {
    const subscription = watch((value, { name, type }) =&gt; console.log(value, name, type));
    return () =&gt; subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: IFormInputs) =&gt; console.log(data);

  return (
    &lt;&gt;
      &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
        &lt;input {...register("name", { required: true, maxLength: 50 })} /&gt;
        &lt;input type="checkbox" {...register("showAge")} /&gt;
        {/* based on yes selection to display Age Input*/}
        {watchShowAge &amp;&amp; (
          &lt;input type="number" {...register("age", { min: 50 })} /&gt;
        )}
        &lt;input type="submit" /&gt;
      &lt;/form&gt;
    &lt;/&gt;
  );
}

```
```javascript
import * as React from "react";
import { useForm, useFieldArray, ArrayField } from "react-hook-form";

function App() {
  const { register, control, handleSubmit, watch } = useForm();
  const { fields, remove, append } = useFieldArray({
    name: "test",
    control
  });
  const onSubmit = (data: FormValues) =&gt; console.log(data);
  
  console.log(watch("test")); 

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      {fields.map((field, index) =&gt; {
        return (
          &lt;input
            key={field.id}
            {...register(`test[${index}].firstName`)}
          /&gt;
        );
      })}
      &lt;button
        type="button"
        onClick={() =&gt;
          append({
            firstName: "bill" + renderCount,
            lastName: "luo" + renderCount
          })
        }
      &gt;
        Append
      &lt;/button&gt;
    &lt;/form&gt;
  );
}

```
## Video
The following video tutorial demonstrates watch API.
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/handlesubmit/

# handleSubmit
Ready to send to the server
#### Menu
## handleSubmit: ((data: Object, e?: Event) => Promise<void>, (errors: Object, e?: Event) => void) => Promise<void>
This function will receive the form data if form validation is successful.
## Props
## Rules
You can easily submit form asynchronously with handleSubmit.
```javascript
// It can be invoked remotely as well
handleSubmit(onSubmit)();

// You can pass an async function for asynchronous validation.
handleSubmit(async (data) =&gt; await fetchAPI(data))
```
disabled inputs will appear as undefined values in form values. If you want to prevent users from updating an input and wish to retain the form value, you can use readOnly or disable the entire <fieldset />. Here is an example.
handleSubmit function will not swallow errors that occurred inside your onSubmit callback, so we recommend you to try and catch inside async request and handle those errors gracefully for your customers.
```javascript
const onSubmit = async () =&gt; {
  // async request which may result error
  try {
    // await fetch()
  } catch (e) {
    // handle your error
  }
};

&lt;form onSubmit={handleSubmit(onSubmit)} /&gt;

```
## Examples
```javascript
import { useForm } from "react-hook-form";

export default function App() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) =&gt; console.log(data, e);
  const onError = (errors, e) =&gt; console.log(errors, e);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit, onError)}&gt;
      &lt;input {...register("firstName")} /&gt;
      &lt;input {...register("lastName")} /&gt;
      &lt;button type="submit"&gt;Submit&lt;/button&gt;
    &lt;/form&gt;
  );
}import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function App() {
  const { register, handleSubmit } = useForm&lt;FormValues&gt;();
  const onSubmit: SubmitHandler&lt;FormValues&gt; = data =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("firstName")} /&gt;
      &lt;input {...register("lastName")} /&gt;
      &lt;input type="email" {...register("email")} /&gt;

      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
```javascript
import React from "react";
import { useForm } from "react-hook-form";

const sleep = ms =&gt; new Promise(resolve =&gt; setTimeout(resolve, ms));

function App() {
  const { register, handleSubmit, formState: { errors }, formState } = useForm();
  const onSubmit = async data =&gt; {
    await sleep(2000);
    if (data.username === "bill") {
      alert(JSON.stringify(data));
    } else {
      alert("There is an error");
    }
  };

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;label htmlFor="username"&gt;User Name&lt;/label&gt;
      &lt;input placeholder="Bill" {...register("username"} /&gt;

      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
## Video
The following video tutorial explains the handleSubmit API in detail.
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/reset/

# reset
Reset form state and values
#### Menu
## reset: <T>(values?: T | ResetAction<T>, options?: Record<string, boolean>) => void
Reset the entire form state, fields reference, and subscriptions. There are optional arguments and will allow partial form state reset.
## Props
Reset has the ability to retain formState. Here are the options you may use: 
An optional object to reset form values, and it's recommended to provide the entire defaultValues when supplied.
All errors will remain. This will not guarantee with further user actions.
DirtyFields form state will remain, and isDirty will temporarily remain as the current state until further user's action.
Important: this keep option doesn't reflect form input values but only dirty fields form state.
DirtyFields and isDirty will remained, and only none dirty fields will be updated to the latest rest value. Check out the example.
Important: formState dirtyFields will need to be subscribed.
Form input values will be unchanged.
Keep the same defaultValues which are initialised via useForm.
isDirty will be checked again: it is set to be the result of the comparison of any new values provided against the original defaultValues.
dirtyFields will be updated again if values are provided: it is set to be result of the comparison between the new values provided against the originaldefaultValues.
isSubmitted state will be unchanged.
isTouched state will be unchanged.
isValid will temporarily persist as the current state until additional user actions.
submitCount state will be unchanged.
## Rules
For controlled components you will need to pass defaultValues to useForm in order to reset the Controller components' value.
When defaultValues is not supplied to reset API, then HTML native reset API will be invoked to restore the form.
Avoid calling reset before useForm's useEffect is invoked, this is because useForm's subscription needs to be ready before reset can send a signal to flush form state update.
It's recommended to reset inside useEffect after submission.
```javascript
useEffect(() =&gt; {
  reset({
    data: 'test'
  })
}, [isSubmitSuccessful])

```
## Examples
```javascript
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const { register, handleSubmit, reset } = useForm();
  const resetAsyncForm = useCallback(async () =&gt; {
    const result = await fetch('./api/formValues.json'); // result: { firstName: 'test', lastName: 'test2' }
    reset(result); // asynchronously reset your form values
  }, [reset]);
  
  useEffect(() =&gt; {
    resetAsyncForm()
  }, [resetAsyncForm])

  return (
    &lt;form onSubmit={handleSubmit((data) =&gt; {})}&gt;
      &lt;input {...register("firstName")} /&gt;
      &lt;input {...register("lastName")} /&gt;
      
      &lt;input type="button" onClick={() =&gt; {
        reset({
          firstName: "bill"
        }, {
          keepErrors: true, 
          keepDirty: true,
        });
      }} /&gt;
      
      &lt;button 
        onClick={() =&gt; {
          reset(formValues =&gt; ({
            ...formValues,
            lastName: 'test',
          }))
        }}
      &gt;
        Reset partial
      &lt;/button&gt;
    &lt;/form&gt;
  );
}
import { useForm } from "react-hook-form";

interface UseFormInputs {
  firstName: string
  lastName: string
}

export default function Form() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm&lt;UseFormInputs&gt;();
  const onSubmit = (data: UseFormInputs) =&gt; {
    console.log(data)
  };

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;label&gt;First name&lt;/label&gt;
      &lt;input {...register("firstName", { required: true })} /&gt;

      &lt;label&gt;Last name&lt;/label&gt;
      &lt;input {...register("lastName")} /&gt;

      &lt;input type="submit" /&gt;
      &lt;input
        type="reset"
        value="Standard Reset Field Values"
      /&gt;
      &lt;input
        type="button"
        onClick={() =&gt; reset()}
        value="Custom Reset Field Values &amp; Errors"
      /&gt;
    &lt;/form&gt;
  );
}

```
```javascript
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";

export default function App() {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const onSubmit = data =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;Controller
        render={({ field }) =&gt; &lt;TextField {...field} /&gt;}
        name="firstName"
        control={control}
        rules={{ required: true }}
        defaultValue=""
      /&gt;
      &lt;Controller
        render={({ field }) =&gt; &lt;TextField {...field} /&gt;}
        name="lastName"
        control={control}
        defaultValue=""
      /&gt;

      &lt;input type="submit" /&gt;
      &lt;input type="button" onClick={reset} /&gt;
      &lt;input
        type="button"
        onClick={() =&gt; {
          reset({
            firstName: "bill",
            lastName: "luo"
          });
        }}
      /&gt;
    &lt;/form&gt;
  );
}
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";

interface IFormInputs {
  firstName: string
  lastName: string
}

export default function App() {
  const { register, handleSubmit, reset, setValue, control } = useForm&lt;IFormInputs&gt;();
  const onSubmit = (data: IFormInputs) =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;Controller
        render={({ field }) =&gt; &lt;TextField {...field} /&gt;}
        name="firstName"
        control={control}
        rules={{ required: true }}
        defaultValue=""
      /&gt;
      &lt;Controller
        render={({ field }) =&gt; &lt;TextField {...field} /&gt;}
        name="lastName"
        control={control}
        defaultValue=""
      /&gt;

      &lt;input type="submit" /&gt;
      &lt;input type="button" onClick={reset} /&gt;
      &lt;input
        type="button"
        onClick={() =&gt; {
          reset({
            firstName: "bill",
            lastName: "luo"
          });
        }}
      /&gt;
    &lt;/form&gt;
  );
}

```
```javascript
import { useForm, useFieldArray, Controller } from "./src";

function App() {
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful }
  } = useForm({ defaultValues: { something: "anything" } });

  const onSubmit = (data) =&gt; {
    // It's recommended to reset in useEffect as execution order matters
    // reset({ ...data })
  };

  React.useEffect(() =&gt; {
    if (formState.isSubmitSuccessful) {
      reset({ something: '' });
    }
  }, [formState, submittedData, reset]);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("something")} /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
```javascript
import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

function App() {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      loadState: "unloaded",
      names: [{ firstName: "Bill", lastName: "Luo" }]
    }
  });
  const { fields, remove } = useFieldArray({
    control,
    name: "names"
  });

  useEffect(() =&gt; {
    reset({
      names: [
        {
          firstName: "Bob",
          lastName: "Actually"
        },
        {
          firstName: "Jane",
          lastName: "Actually"
        }
      ]
    });
  }, [reset]);

  const onSubmit = (data) =&gt; console.log("data", data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;ul&gt;
        {fields.map((item, index) =&gt; (
          &lt;li key={item.id}&gt;
            &lt;input {...register(`names.${index}.firstName`)} /&gt;

            &lt;Controller
              render={({ field }) =&gt; &lt;input {...field} /&gt;}
              name={`names.${index}.lastName`}
              control={control}
            /&gt;
            &lt;button type="button" onClick={() =&gt; remove(index)}&gt;Delete&lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;

      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
## Video
The following video explains in detail each different formState represents and functionality within the reset API.
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/resetfield/

# resetField
Reset field state and value
#### Menu
## resetField: (name: string, options?: Record<string, boolean | any>) => void
Reset an individual field state.
## Props
After invoke this function.
isValid form state will be reevaluated.
isDirty form state will be reevaluated.
ResetField has the ability to retain field state. Here are the options you may want to use: 
registered field name.
When set to true, field error will be retained.
When set to true, dirtyFields will be retained.
When set to true, touchedFields state will be unchanged.
When this value is not provided, field will be revert back to it's defaultValue.
When this value is provided:
field will be updated with the supplied value.
field's defaultValue will be updated to this value.
## Rules
name need to match registered field name.
```javascript
register('test');

resetField('test'); // ✅ register input and resetField works
resetField('non-existent-name'); // ❌ failed by input not found

```
## Examples
```javascript
import * as React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const {
    register,
    resetField,
    formState: { isDirty, isValid }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: ""
    }
  });
  const handleClick = () =&gt; resetField("firstName");

  return (
    &lt;form&gt;
      &lt;input {...register("firstName", { required: true })} /&gt;

      &lt;p&gt;{isDirty &amp;&amp; "dirty"}&lt;/p&gt;
      &lt;p&gt;{isValid &amp;&amp; "valid"}&lt;/p&gt;

      &lt;button type="button" onClick={handleClick}&gt;
        Reset
      &lt;/button&gt;
    &lt;/form&gt;
  );
}

```
```javascript
import * as React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const {
    register,
    resetField,
    formState: { isDirty, isValid, errors, touchedFields, dirtyFields }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: ""
    }
  });

  return (
    &lt;form&gt;
      &lt;input {...register("firstName", { required: true })} /&gt;

      &lt;p&gt;isDirty: {isDirty &amp;&amp; "dirty"}&lt;/p&gt;
      &lt;p&gt;touchedFields: {touchedFields.firstName &amp;&amp; "touched field"}&lt;/p&gt;
      &lt;p&gt;dirtyFields:{dirtyFields.firstName &amp;&amp; "dirty field"}&lt;/p&gt;
      &lt;p&gt;isValid: {isValid &amp;&amp; "valid"}&lt;/p&gt;
      &lt;p&gt;error: {errors.firstName &amp;&amp; "error"}&lt;/p&gt;
      
      &lt;hr /&gt;

      &lt;button
        type="button"
        onClick={() =&gt; resetField("firstName", { keepError: true })}
      &gt;
        Reset keep error
      &lt;/button&gt;
      &lt;button
        type="button"
        onClick={() =&gt; resetField("firstName", { keepTouched: true })}
      &gt;
        Reset keep touched fields
      &lt;/button&gt;
      &lt;button
        type="button"
        onClick={() =&gt; resetField("firstName", { keepDirty: true })}
      &gt;
        Reset keep dirty fields
      &lt;/button&gt;
      &lt;button
        type="button"
        onClick={() =&gt; resetField("firstName", { defaultValue: "New" })}
      &gt;
        update defaultValue
      &lt;/button&gt;
    &lt;/form&gt;
  );
}

```
## Video
The following video tutorial demonstrates resetField API.
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/seterror/

# setError
Manually set an input error
#### Menu
## setError:(name: string, error: FieldError, { shouldFocus?: boolean }) => void
The function allows you to manually set one or more errors.
## Props
input's name.
Set an error with its type and message.
Should focus the input during setting an error. This only works when the input's reference is registered, it will not work for custom register as well.
## Rules
This method will not persist the associated input error if the input passes register's associated rules.
```javascript
register('registerInput', { minLength: 4 }});
setError('registerInput', { type: 'custom', message: 'custom message' });
// validation will pass as long as minLength requirement pass

```
An error that is not associated with an input field will be persisted until cleared with clearErrors. This behaviour is only applicable for built-in validation at field level.
```javascript
setError('notRegisteredInput', { type: 'custom', message: 'custom message' });
// clearErrors() need to invoked manually to remove that custom error 

```
You can set a server or global error with root as the key. This type of error will not persist with each submission.
```javascript
setError('root.serverError', { 
  type: '400',
});
setError('root.random', { 
  type: 'random', 
});
```
Can be useful in the handleSubmit method when you want to give error feedback to a user after async validation. (ex: API returns validation errors)
shouldFocus doesn't work when an input has been disabled.
This method will force set isValid formState to false, however, it's important to aware isValid will always be derived by the validation result from your input registration rules or schema result.
There are certain keyword which need to avoid before conflicting with type check. They are type, types
## Examples
```javascript
import { useForm } from "react-hook-form";

const App = () =&gt; {
  const { register, setError, formState: { errors } } = useForm();

  return (
    &lt;form&gt;
      &lt;input {...register("test")} /&gt;
      {errors.test &amp;&amp; &lt;p&gt;{errors.test.message}&lt;/p&gt;}

      &lt;button
        type="button"
        onClick={() =&gt; {
          setError("test", { type: "focus" }, { shouldFocus: true });
        }}
      &gt;
        Set Error Focus
      &lt;/button&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};
import * as React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  username: string;
};

const App = () =&gt; {
  const { register, handleSubmit, setError, formState: { errors } } = useForm&lt;FormInputs&gt;();
  const onSubmit = (data: FormInputs) =&gt; {
    console.log(data)
  };

  React.useEffect(() =&gt; {
    setError("username", {
      type: "manual",
      message: "Dont Forget Your Username Should Be Cool!"
    });
  }, [setError])

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("username")} /&gt;
      {errors.username &amp;&amp; &lt;p&gt;{errors.username.message}&lt;/p&gt;}

      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};
```
```javascript
import * as React from "react";
import { useForm } from "react-hook-form";

const App = () =&gt; {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  const onSubmit = data =&gt; {
    console.log(data)
  };

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;label&gt;Username&lt;/label&gt;
      &lt;input {...register("username")} /&gt;
      {errors.username &amp;&amp; &lt;p&gt;{errors.username.message}&lt;/p&gt;}
      &lt;label&gt;First Name&lt;/label&gt;
      &lt;input {...register("firstName")} /&gt;
      {errors.firstName &amp;&amp; &lt;p&gt;{errors.firstName.message}&lt;/p&gt;}
      &lt;button
        type="button"
        onClick={() =&gt; {
          [
            {
              type: "manual",
              name: "username",
              message: "Double Check This"
            },
            {
              type: "manual",
              name: "firstName",
              message: "Triple Check This"
            }
          ].forEach(({ name, type, message }) =&gt;
            setError(name, { type, message })
          );
        }}
      &gt;
        Trigger Name Errors
      &lt;/button&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};
import * as React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  username: string;
  firstName: string;
};

const App = () =&gt; {
  const { register, handleSubmit, setError, formState: { errors } } = useForm&lt;FormInputs&gt;();

  const onSubmit = (data: FormInputs) =&gt; {
    console.log(data)
  };

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;label&gt;Username&lt;/label&gt;
      &lt;input {...register("username")} /&gt;
      {errors.username &amp;&amp; &lt;p&gt;{errors.username.message}&lt;/p&gt;}
      &lt;label&gt;First Name&lt;/label&gt;
      &lt;input {...register("firstName")} /&gt;
      {errors.firstName &amp;&amp; &lt;p&gt;{errors.firstName.message}&lt;/p&gt;}
      &lt;button
        type="button"
        onClick={() =&gt; {
          [
            {
              type: "manual",
              name: "username",
              message: "Double Check This"
            },
            {
              type: "manual",
              name: "firstName",
              message: "Triple Check This"
            }
          ].forEach(({ name, type, message }) =&gt;
            setError(name, { type, message })
          );
        }}
      &gt;
        Trigger Name Errors
      &lt;/button&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};

```
```javascript
import * as React from "react";
import { useForm } from "react-hook-form";

const App = () =&gt; {
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    criteriaMode: 'all',
  });
  const onSubmit = data =&gt; {
    console.log(data)
  };
  
  React.useEffect(() =&gt; {
    setError("lastName", {
      types: {
        required: "This is required",
        minLength: "This is minLength"
      }
    });
  }, [setError])

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;label&gt;Last Name&lt;/label&gt;
      &lt;input {...register("lastName")} /&gt;
      {errors.lastName &amp;&amp; errors.lastName.types &amp;&amp; (
        &lt;p&gt;{errors.lastName.types.required}&lt;/p&gt;
      )}
      {errors.lastName &amp;&amp; errors.lastName.types &amp;&amp; (
        &lt;p&gt;{errors.lastName.types.minLength}&lt;/p&gt;
      )}
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};
import * as React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  lastName: string;
};

const App = () =&gt; {
  const { register, handleSubmit, setError, formState: { errors } } = useForm&lt;FormInputs&gt;({
    criteriaMode: 'all',
  });
  
  const onSubmit = (data: FormInputs) =&gt; console.log(data);
  
  React.useEffect(() =&gt; {
    setError("lastName", {
      types: {
        required: "This is required",
        minLength: "This is minLength"
      }
    });
  }, [setValue])

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;label&gt;Last Name&lt;/label&gt;
      &lt;input {...register("lastName")} /&gt;
      {errors.lastName &amp;&amp; errors.lastName.types &amp;&amp; (
        &lt;p&gt;{errors.lastName.types.required}&lt;/p&gt;
      )}
      {errors.lastName &amp;&amp; errors.lastName.types &amp;&amp; (
        &lt;p&gt;{errors.lastName.types.minLength}&lt;/p&gt;
      )}
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};

```
```javascript
import * as React from "react";
import { useForm } from "react-hook-form";

const App = () =&gt; {
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    criteriaMode: 'all',
  });
  const onSubmit = async () =&gt; {
    const response = await fetch(...)
    if (response.statusCode &gt; 200) {
        setError('root.serverError', { 
          type: response.statusCode,
        })
    }
  }

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;label&gt;Last Name&lt;/label&gt;
      &lt;input {...register("lastName")} /&gt;
      
      {errors.root.serverError.type === 400 &amp;&amp; &lt;p&gt;server response message&lt;/p&gt;}
      
      &lt;button&gt;submit&lt;/button&gt;
    &lt;/form&gt;
  );
};

```
## Video
The following video explain setError API in detail.
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/clearerrors/

# clearErrors
Clear form errors
#### Menu
## clearErrors: (name?: string | string[]) => void
This function can manually clear errors in the form.
## Props
undefined: reset all errors
string: reset the error on a single field or by key name.
```javascript
register('test.firstName', { required: true });
register('test.lastName', { required: true });
clearErrors('test'); // will clear both errors from test.firstName and test.lastName
clearErrors('test.firstName'); // for clear single input error

```
string[]: reset errors on the given fields
## Rules
This will not affect the validation rules attached to each inputs.
This method doesn't affect validation rules or isValid formState.
## Examples
```javascript
import * as React from "react";
import { useForm } from "react-hook-form";

const App = () =&gt; {
  const { register, formState: { errors }, handleSubmit, clearErrors } = useForm();
  const onSubmit = data =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register('firstName', { required: true })} /&gt;
      &lt;input {...register('lastName', { required: true })} /&gt;
      &lt;input {...register('username', { required: true })} /&gt;
      &lt;button type="button" onClick={() =&gt; clearErrors("firstName")}&gt;
        Clear First Name Errors
      &lt;/button&gt;
      &lt;button
        type="button"
        onClick={() =&gt; clearErrors(["firstName", "lastName"])}
      &gt;
        Clear First and Last Name Errors
      &lt;/button&gt;
      &lt;button type="button" onClick={() =&gt; clearErrors()}&gt;
        Clear All Errors
      &lt;/button&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};
import * as React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  firstName: string;
  lastName: string;
  username: string;
};

const App = () =&gt; {
  const { register, formState: { errors }, handleSubmit, clearErrors } = useForm&lt;FormInputs&gt;();

  const onSubmit = (data: FormInputs) =&gt; {
    console.log(data)
  };

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register('firstName', { required: true })} /&gt;
      &lt;input {...register('lastName', { required: true })} /&gt;
      &lt;input {...register('username', { required: true })} /&gt;
      &lt;button type="button" onClick={() =&gt; clearErrors("firstName")}&gt;
        Clear First Name Errors
      &lt;/button&gt;
      &lt;button
        type="button"
        onClick={() =&gt; clearErrors(["firstName", "lastName"])}
      &gt;
        Clear First and Last Name Errors
      &lt;/button&gt;
      &lt;button type="button" onClick={() =&gt; clearErrors()}&gt;
        Clear All Errors
      &lt;/button&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};

```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/setvalue/

# setValue
Update field value
#### Menu
## setValue: (name: string, value: unknown, config?: Object) => void
This function allows you to dynamically set the value of a registered field and have the options to validate and update the form state. At the same time, it tries to avoid unnecessary rerender.
## Props
Target a single field by name.
When used with field array.
You can use methods such as replace or update for field array, however, they will cause the component to unmount and remount for the targeted field array.
```javascript
const { update } = useFieldArray({ name: 'array' });
                            
// unmount fields and remount with updated value
update(0, { test: '1', test1: '2' }) 

// will directly update input value
setValue('array.0.test1', '1');
setValue('array.0.test2', '2');

```
It will not create a new field when targeting a non-existing field.
```javascript
const { replace } = useFieldArray({ name: 'test' })
                          
// ❌ doesn't create new input  
setValue('test.101.data') 

// ✅ work on refresh entire field array
replace([{data: 'test'}]) 

```
The value for the field. This argument is required and can not be undefined.
Whether to compute if your input is valid or not (subscribed to errors).
Whether to compute if your entire form is valid or not (subscribed to isValid).
```javascript
setValue('name', 'value', { shouldValidate: true })
```
Whether to compute if your input is dirty or not against your defaultValues (subscribed to dirtyFields).
Whether to compute if your entire form is dirty or not against your defaultValues (subscribed to isDirty).
```javascript
setValue('name', 'value', { shouldDirty: true })
```
Whether to set the input itself to be touched.
```javascript
setValue('name', 'value', { shouldTouch: true })
```
## Rules
Only the following conditions will trigger a re-render:
When an error is triggered or corrected by a value update
When setValue cause state update, such as dirty and touched.
It's recommended to target the field's name rather than make the second argument a nested object.
```javascript
setValue('yourDetails.firstName', 'value'); // ✅ performant
setValue('yourDetails', { firstName: 'value' }); // less performant

register('nestedValue', { value: { test: 'data' } }); // register a nested value input
setValue('nestedValue.test', 'updatedData'); // ❌ failed to find the relevant field
setValue('nestedValue', { test: 'updatedData' } ); // ✅ setValue find input and update

```
It's recommended to register the input's name before invoking setValue. To update the entire Field Array, make sure the useFieldArray hook is being executed first.
Important:  use replace from useFieldArray instead, update entire field array with setValue will be removed in the next major version.
```javascript
// you can update an entire Field Array,
setValue('fieldArray', [{ test: '1' }, { test: '2' }]); // ✅

// you can setValue to a unregistered input
setValue('notRegisteredInput', 'value'); // ✅ prefer to be registered

// the following will register a single input (without register invoked)
setValue('resultSingleNestedField', { test: '1', test2: '2' }); // 🤔

// with registered inputs, the setValue will update both inputs correctly.
register('notRegisteredInput.test', '1')
register('notRegisteredInput.test2', '2')
setValue('notRegisteredInput', { test: '1', test2: '2' }); // ✅ sugar syntax to setValue twice

```
## Examples
```javascript
import { useForm } from "react-hook-form";

const App = () =&gt; {
  const { register, setValue } = useForm();
  
  return (
    &lt;form&gt;
      &lt;input {...register("firstName")} /&gt;
      &lt;button type="button" onClick={() =&gt; setValue("firstName", "Bill")}&gt;
        setValue
      &lt;/button&gt;
      &lt;button
        type="button"
        onClick={() =&gt;
          setValue("lastName", "firstName", {
            shouldValidate: true,
            shouldDirty: true
          })
        }
      &gt;
        setValue options
      &lt;/button&gt;
    &lt;/form&gt;
  );
};
import { useForm } from "react-hook-form";

const App = () =&gt; {
  const { register, setValue } = useForm({
    firstName: ''
  });

  return (
    &lt;form&gt;
      &lt;input {...register("firstName", { required: true })} /&gt;
      &lt;button onClick={() =&gt; setValue("firstName", "Bill")}&gt;
        setValue
      &lt;/button&gt;
      &lt;button
        onClick={() =&gt;
          setValue("firstName", "Luo", {
            shouldValidate: true,
            shouldDirty: true
          })
        }
      &gt;
        setValue options
      &lt;/button&gt;
    &lt;/form&gt;
  );
};
import React from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  string: string;
  number: number;
  object: {
    number: number;
    boolean: boolean;
  };
  array: {
    string: string;
    boolean: boolean;
  }[];
};

export default function App() {
  const { setValue } = useForm&lt;FormValues&gt;();
  
  setValue("string", "test");
  // function setValue&lt;"string", string&gt;(name: "string", value: string, shouldValidate?: boolean | undefined): void
  setValue("number", 1);
  // function setValue&lt;"number", number&gt;(name: "number", value: number, shouldValidate?: boolean | undefined): void
  setValue("number", "error");
  
  return &lt;form /&gt;;
}
```
```javascript
import * as React from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  a: string;
  b: string;
  c: string;
};

export default function App() {
  const { watch, register, handleSubmit, setValue, formState } = useForm&lt;
    FormValues
  &gt;({
    defaultValues: {
      a: "",
      b: "",
      c: ""
    }
  });
  const onSubmit = (data: FormValues) =&gt; console.log(data);
  const [a, b] = watch(["a", "b"]);

  React.useEffect(() =&gt; {
    if (formState.touchedFields.a &amp;&amp; formState.touchedFields.b &amp;&amp; a &amp;&amp; b) {
      setValue("c", `${a} ${b}`);
    }
  }, [setValue, a, b, formState]);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("a")} placeholder="a" /&gt;
      &lt;input {...register("b")} placeholder="b" /&gt;
      &lt;input {...register("c")} placeholder="c" /&gt;
      &lt;input type="submit" /&gt;

      &lt;button
        type="button"
        onClick={() =&gt; {
          setValue("a", "what", { shouldTouch: true });
          setValue("b", "ever", { shouldTouch: true });
        }}
      &gt;
        trigger value
      &lt;/button&gt;
    &lt;/form&gt;
  );
}

```
## Video
The following video tutorial demonstrates setValue API in detail.
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/setfocus/

# setFocus
Manually set an input focus
#### Menu
## setFocus:(name: string, options: SetFocusOptions) => void
This method will allow users to programmatically focus on input. Make sure input's ref is registered into the hook form.
## Props
A input field name to focus
Whether to select the input content on focus.
```javascript
const { setFocus } = useForm()

setFocus("name", { shouldSelect: true })

```
## Rules
This API will invoke focus method from the ref, so it's important to provide ref during register.
Avoid calling setFocus right after reset as all input references will be removed by reset API.
## Examples
```javascript
import * as React from "react";
import { useForm } from "./src";

export default function App() {
  const { register, handleSubmit, setFocus } = useForm();
  const onSubmit = (data) =&gt; console.log(data);
  renderCount++;

  React.useEffect(() =&gt; {
    setFocus("firstName");
  }, [setFocus]);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("firstName")} placeholder="First Name" /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}
import * as React from "react";
import { useForm } from "./src";

type FormValues = {
  firstName: string;
};

export default function App() {
  const { register, handleSubmit, setFocus } = useForm&lt;FormValues&gt;();
  const onSubmit = (data: FormValues) =&gt; console.log(data);
  renderCount++;

  React.useEffect(() =&gt; {
    setFocus("firstName");
  }, [setFocus]);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("firstName")} placeholder="First Name" /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/getvalues/

# getValues
Get form values
#### Menu
## getValues: (payload?: string | string[]) => Object
An optimized helper for reading form values. The difference between watch and getValues is that getValues will not trigger re-renders or subscribe to input changes.
## Props
### Example
The example below shows what to expect when you invoke getValues method.
```javascript
&lt;input {...register('root.test1')} /&gt;
&lt;input {...register('root.test2')} /&gt;

```
## Rules
Disabled inputs will be returned as undefined. If you want to prevent users from updating the input and still retain the field value, you can use readOnly or disable the entire <fieldset />. Here is an example.
It will return defaultValues from useForm before the initial render.
## Examples
```javascript
import { useForm } from "react-hook-form";

export default function App() {
  const { register, getValues } = useForm();

  return (
    &lt;form&gt;
      &lt;input {...register("test")} /&gt;
      &lt;input {...register("test1")} /&gt;

      &lt;button
        type="button"
        onClick={() =&gt; {
          const values = getValues(); // { test: "test-input", test1: "test1-input" }
          const singleValue = getValues("test"); // "test-input"
          const multipleValues = getValues(["test", "test1"]);
          // ["test-input", "test1-input"]
        }}
      &gt;
        Get Values
      &lt;/button&gt;
    &lt;/form&gt;
  );
}import React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  test: string
  test1: string
}

export default function App() {
  const { register, getValues } = useForm&lt;FormInputs&gt;();

  return (
    &lt;form&gt;
      &lt;input {...register("test")} /&gt;
      &lt;input {...register("test1")} /&gt;

      &lt;button
        type="button"
        onClick={() =&gt; {
          const values = getValues(); // { test: "test-input", test1: "test1-input" }
          const singleValue = getValues("test"); // "test-input"
          const multipleValues = getValues(["test", "test1"]);
          // ["test-input", "test1-input"]
        }}
      &gt;
        Get Values
      &lt;/button&gt;
    &lt;/form&gt;
  );
}import React from "react";
import { useForm } from "react-hook-form";

// Flat input values
type Inputs = {
  key1: string;
  key2: number;
  key3: boolean;
  key4: Date;
};

export default function App() {
  const { register, getValues } = useForm&lt;Inputs&gt;();
  
  getValues();
  
  return &lt;form /&gt;;
}

// Nested input values
type Inputs1 = {
  key1: string;
  key2: number;
  key3: {
    key1: number;
    key2: boolean;
  };
  key4: string[];
};

export default function Form() {
  const { register, getValues } = useForm&lt;Inputs1&gt;();
  
  getValues();
  // function getValues(): Record&lt;string, unknown&gt;
  getValues("key1");
  // function getValues&lt;"key1", unknown&gt;(payload: "key1"): string
  getValues("key2");
  // function getValues&lt;"key2", unknown&gt;(payload: "key2"): number
  getValues("key3.key1");
  // function getValues&lt;"key3.key1", unknown&gt;(payload: "key3.key1"): unknown
  getValues&lt;string, number&gt;("key3.key1");
  // function getValues&lt;string, number&gt;(payload: string): number
  getValues&lt;string, boolean&gt;("key3.key2");
  // function getValues&lt;string, boolean&gt;(payload: string): boolean
  getValues("key4");
  // function getValues&lt;"key4", unknown&gt;(payload: "key4"): string[]

  return &lt;form /&gt;;
}

```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/getfieldstate/

# getFieldState
State of the field
#### Menu
## getFieldState: (name: string, formState?: Object) => ({isDirty, isTouched, invalid, error})
This method is introduced in react-hook-form (v7.25.0) to return individual field state. It's useful in case you are trying to retrieve nested field state in a typesafe way.
## Props
registered field name.
formState
This is an optional prop, which is only required if formState is not been read/subscribed from the useForm, useFormContext or useFormState.
```javascript

```
## Return
field is modified.
Condition: subscribe to dirtyFields.
isTouched
field has received a focus and blur event.
Condition: subscribe to touchedFields.
invalid
field is not valid.
Condition: subscribe to errors.
error
field error object.
Condition: subscribe to errors.
## Rules
name needs to match a registered field name.
```javascript

```
getFieldState works by subscribing to the form state update, and you can subscribe to the formState in the following ways:
You can subscribe at the useForm, useFormContext or useFormState. This is will establish the form state subscription and getFieldState second argument will no longer be required.
```javascript

```
```javascript

```
```javascript

```
When form state subscription is not setup, you can pass the entire formState as the second optional argument by following the example below:
```javascript

```
## Examples
```javascript

```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/trigger/

# trigger
Trigger validation across the form
#### Menu
## trigger: (name?: string | string[]) => Promise<boolean>
Manually triggers form or input validation. This method is also useful when you have dependant validation (input validation depends on another input's value).
## Props
Should focus the input during setting an error. This only works when the input's reference is registered, it will not work for custom register as well.
## Rules
Isolate render optimisation only applicable for targeting a single field name with string as payload, when supplied with array and undefined to trigger will re-render the entire formState.
## Examples
```javascript
import React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const { register, trigger, formState: { errors } } = useForm();

  return (
    &lt;form&gt;
      &lt;input {...register("firstName", { required: true })} /&gt;
      &lt;input {...register("lastName", { required: true })} /&gt;
      &lt;button
        type="button"
        onClick={async () =&gt; {
          const result = await trigger("lastName");
          // const result = await trigger("lastName", { shouldFocus: true }); allowed to focus input
        }}
      &gt;
        Trigger
      &lt;/button&gt;
      &lt;button
        type="button"
        onClick={async () =&gt; {
          const result = await trigger(["firstName", "lastName"]);
        }}
      &gt;
        Trigger Multiple
      &lt;/button&gt;
      &lt;button
        type="button"
        onClick={() =&gt; {
          trigger();
        }}
      &gt;
        Trigger All
      &lt;/button&gt;
    &lt;/form&gt;
  );
}
import React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  firstName: string
  lastName: string
}

export default function App() {
  const { register, trigger, formState: { errors } } = useForm&lt;FormInputs&gt;();

  return (
    &lt;form&gt;
      &lt;input {...register("firstName", { required: true })} /&gt;
      &lt;input {...register("lastName", { required: true })} /&gt;
      &lt;button type="button" onClick={() =&gt; { trigger("lastName"); }}&gt;Trigger&lt;/button&gt;
      &lt;button type="button" onClick={() =&gt; { trigger(["firstName", "lastName"]); }}&gt;Trigger Multiple&lt;/button&gt;
      &lt;button type="button" onClick={() =&gt; { trigger(); }}&gt;Trigger All&lt;/button&gt;
    &lt;/form&gt;
  );
}
```
## Video
The following video explain trigger API in detail.
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/control/

# control
Take control of the form
#### Menu
## control: Object
This object contains methods for registering components into React Hook Form.
## Rules
Important: do not access any of the properties inside this object directly. It's for internal usage only.
## Examples
```javascript
import { useForm, Controller } from "react-hook-form";

function App() {
  const { control } = useForm();
  
  return (
    &lt;Controller
      render={({ field }) =&gt; &lt;input {...field} /&gt;}
      name="firstName"
      control={control}
      defaultValue=""
    /&gt;
  );
}
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";

type FormInputs = {
  firstName: string
}

function App() {
  const { control, handleSubmit } = useForm&lt;FormInputs&gt;();
  const onSubmit = (data: FormInputs) =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;Controller
        as={TextField}
        name="firstName"
        control={control}
        defaultValue=""
      /&gt;
      
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useform/form/

# Form (BETA)
Take care form submission
#### Menu
## Form: Component
Note: This component is currently in BETA
This component is optional and it takes care of the form submission by closely aligning with the standard native form.
By default, we will send a POST request with your form submission data as FormData. You can supply headers prop to avoid FormData to be submitted and use application/json instead.
Progressively enhancement for your form.
Support both React Web and React Native.
Take care of form submission handling.
```javascript
&lt;Form
  action="/api"
  method="post" // default to post
  onSubmit={() =&gt; {}} // function to be called before the request
  onSuccess={() =&gt; {}} // valid response
  onError={() =&gt; {}} // error response
  validateStatus={status =&gt; status &gt;= 200} // validate status code
/&gt;
```
## Props
All props all optional
control object provided by invoking useForm. Optional when using FormProvider.
```javascript
&lt;Form control={control} /&gt;
```
Render prop function suitable for headless component.
```javascript
&lt;Form 
  render={({ submit }) =&gt; &lt;View /&gt;} 
/&gt;
```
Function invoked after successful validation.
```javascript
&lt;Form 
  onSubmit={data =&gt; mutation(data)} 
/&gt;
```
Function called after successful request to the server.
```javascript
&lt;Form 
  onSuccess={({ response }) =&gt; {}} 
/&gt;
```
Function called after failed request to the server.
setError function will be called to update errors state.
```javascript
&lt;Form 
  onError={({ response }) =&gt; {}} 
/&gt;
```
Request headers object.
```javascript
&lt;Form 
  headers={{
    accessToken: 'xxx',
    // Json content type 
    // will stringify form data
    'Content-Type': 'application/json'
  }}
/&gt;
```
Function to validate status code.
```javascript
&lt;Form 
  validateStatus={status =&gt; status === 200}
/&gt;
```
Custom fetcher callback function
```javascript
// with server state library
&lt;Form 
  fetcher={
   (action, { values }) =&gt; axios(action, values})}
/&gt;

// with custom axios
&lt;Form 
  fetcher={
   (action, { values }) =&gt; mutation(values)}
/&gt;

```
## Rules
If want to prepare or omit submission data, please use handleSubmit or custom fetcher.
```javascript
const { handleSubmit, control } = useForm();
const onSubmit =(data) =&gt; callback(prepareData(data))

&lt;form onSubmit={handleSubmit(onSubmit)} /&gt;
// or
&lt;Form action="/api" control={control} fetcher={(action, { values }) =&gt; onSubmit(values)} /&gt;

```
Progressive Enhancement only applicable for SSR framework.
```javascript
const { handleSubmit, control } = useForm({
  progressive: true                    
});

&lt;Form onSubmit={onSubmit} control={control} action="/api/test" method="post"&gt;
  &lt;input {...register('test', { required: true })} /&gt;
&lt;/Form /&gt;

// Renders
&lt;form action="/api/test" method="post"&gt;
  &lt;input required name="test" /&gt;
&lt;/form&gt;

```
It's sufficient enough to just use the handleSubmit callback with server state library, but you can use with SWR or TanQuery to support progressively enhancement.
```javascript
const { handleSubmit, control } = useForm({
  progressive: true                    
});
const [mounted, setMounted] = useState(false)
const mutation = useMutation();

&lt;form onSubmit={handleSubmit(mutation)} /&gt;

&lt;Form fetcher={(action, { values }) =&gt; mutation(values)} action={'/api/something'/}&gt;

```
## Examples
```javascript
import { useForm } from 'react-hook-form';

function App() {
  const { control, register, formState: { isSubmitSuccessful, errors } } = useForm({
    // progressive: true, optional prop for progressive enhancement
  });
  
  return (
    &lt;Form action="/api" control={control}&gt;
      &lt;input {...register('name')} /&gt;
    
      {isSubmitSuccessful &amp;&amp; &lt;p&gt;Form submit successful.&lt;/p&gt;}
      
      {errors?.root?.server &amp;&amp; &lt;p&gt;Form submit failed.&lt;/p&gt;}
    
      &lt;button&gt;submit&lt;/button&gt;
    &lt;/Form&gt;
  )
}
```
```javascript
import { uesForm } from 'react-hook-form';

function App() {
  const { control, register, formState: { isSubmitSuccessful, errors } } = useForm();
  
  return (
    &lt;Form 
      action="/api" 
      control={control} 
      render={({ submit }) =&gt; {
        &lt;View&gt;
          {isSubmitSuccessful &amp;&amp; &lt;Text&gt;Form submit successful.&lt;Text&gt;}
          
          {errors?.root?.server &amp;&amp; &lt;Text&gt;Form submit failed.&lt;/Text&gt;}
        
          &lt;Button onPress={() =&gt; submit()} /&gt;
        &lt;/View&gt;
      }}
    /&gt;
  )
}
```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/usecontroller/

# useController
React hooks for controlled component
#### Menu
## useController:(props?: UseControllerProps) => { field: object, fieldState: object, formState: object }
This custom hook powers Controller. Additionally, it shares the same props and methods as Controller. It's useful for creating reusable Controlled input.
## Props
The following table contains information about the arguments for useController.
Important: Can not apply undefined to defaultValue or defaultValues at useForm.
You need to either set defaultValue at the field-level or useForm's defaultValues. undefined is not a valid value.
If your form will invoke reset with default values, you will need to provide useForm with defaultValues.
Validation rules in the same format for register, which includes:
required, min, max, minLength, maxLength, pattern, validate
```javascript
rules={{ required: true }}
```
Input will be unregistered after unmount and defaultValues will be removed as well.
Note: this prop should be avoided when using with useFieldArray as unregister function gets called after input unmount/remount and reorder.
## Return
The following table contains information about properties which useController produces.
A function which sends the input's value to the library.
This prop update formState and you should avoid manually invoke setValue or other API related to field update.
A function which sends the input's onBlur event to the library. It should be assigned to the input's onBlur prop.
The current value of the controlled component.
Input's name being registered.
A ref used to connect hook form to the input. Assign ref to component's input ref to allow hook form to focus the error input.
Invalid state for current input.
Touched state for current controlled input.
Dirty state for current controlled input.
error for this specific input.
Set to true after the user modifies any of the inputs.
Important: Make sure to provide all inputs' defaultValues at the useForm, so hook form can have a single source of truth to compare whether the form is dirty.
```javascript
const {
  formState: { isDirty, dirtyFields },
  setValue,
} = useForm({ defaultValues: { test: "" } });

// isDirty: true
setValue('test', 'change')
 
// isDirty: false because there getValues() === defaultValues
setValue('test', '') 

```
File typed input will need to be managed at the app level due to the ability to cancel file selection and FileList object.
An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues.
Important: Make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness.
Dirty fields will not represent as isDirty formState, because dirty fields are marked field dirty at field level rather the entire form. If you want to determine the entire form state use isDirty instead.
The value which has been set at useForm's defaultValues or updated defaultValues via reset API.
Indicate the form was successfully submitted without any runtime error.
true if the form is currently loading async default values.
Important: this prop is only applicable to async defaultValues
```javascript
const { 
  formState: { isLoading } 
} = useForm({ 
  defaultValues: async () =&gt; await fetch('/api') 
});

```
setError has no effect on isValid formState, isValid will always derived via the entire form validation result.
## Examples
```javascript
import { TextField } from "@material-ui/core";
import { useController, useForm } from "react-hook-form";

function Input({ control, name }) {
  const {
    field,
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields }
  } = useController({
    name,
    control,
    rules: { required: true },
  });

  return (
    &lt;TextField 
      onChange={field.onChange} // send value to hook form 
      onBlur={field.onBlur} // notify when input is touched/blur
      value={field.value} // input value
      name={field.name} // send down the input name
      inputRef={field.ref} // send input ref, so we can focus on input when error appear
    /&gt;
  );
}
import * as React from "react";
import { useForm, useController, UseControllerProps } from "react-hook-form";

type FormValues = {
  FirstName: string;
};

function Input(props: UseControllerProps&lt;FormValues&gt;) {
  const { field, fieldState } = useController(props);

  return (
    &lt;div&gt;
      &lt;input {...field} placeholder={props.name} /&gt;
      &lt;p&gt;{fieldState.isTouched &amp;&amp; "Touched"}&lt;/p&gt;
      &lt;p&gt;{fieldState.isDirty &amp;&amp; "Dirty"}&lt;/p&gt;
      &lt;p&gt;{fieldState.invalid ? "invalid" : "valid"}&lt;/p&gt;
    &lt;/div&gt;
  );
}

export default function App() {
  const { handleSubmit, control } = useForm&lt;FormValues&gt;({
    defaultValues: {
      FirstName: ""
    },
    mode: "onChange"
  });
  const onSubmit = (data: FormValues) =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;Input control={control} name="FirstName" rules={{ required: true }} /&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
```javascript
import * as React from "react";
import { useController, useForm } from "react-hook-form";

const Checkboxes = ({ options, control, name }) =&gt; {
  const { field } = useController({
    control,
    name
  });
  const [value, setValue] = React.useState(field.value || []);

  return (
    &lt;&gt;
      {options.map((option, index) =&gt; (
        &lt;input
          onChange={(e) =&gt; {
            const valueCopy = [...value];

            // update checkbox value
            valueCopy[index] = e.target.checked ? e.target.value : null;

            // send data to react hook form
            field.onChange(valueCopy);

            // update local state
            setValue(valueCopy);
          }}
          key={option}
          checked={value.includes(option)}
          type="checkbox"
          value={option}
        /&gt;
      ))}
    &lt;/&gt;
  );
};

export default function App() {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      controlled: [],
      uncontrolled: []
    }
  });
  const onSubmit = (data) =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;section&gt;
        &lt;h2&gt;uncontrolled&lt;/h2&gt;
        &lt;input {...register("uncontrolled")} type="checkbox" value="A" /&gt;
        &lt;input {...register("uncontrolled")} type="checkbox" value="B" /&gt;
        &lt;input {...register("uncontrolled")} type="checkbox" value="C" /&gt;
      &lt;/section&gt;

      &lt;section&gt;
        &lt;h2&gt;controlled&lt;/h2&gt;
        &lt;Checkboxes
          options={["a", "b", "c"]}
          control={control}
          name="controlled"
        /&gt;
      &lt;/section&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
## Tips
It's important to be aware of each prop's responsibility when working with external controlled components, such as MUI, AntD, Chakra UI. Its job is to spy on the input, report, and set its value.
onChange: send data back to hook form
onBlur: report input has been interacted (focus and blur)
value: set up input initial and updated value
ref: allow input to be focused with error
name: give input an unique name
It's fine to host your state and combined with useController.
```javascript
const { field } = useController();
const [value, setValue] = useState(field.value);

onChange={(event) =&gt; {
  field.onChange(parseInt(event.target.value)) // data send back to hook form
  setValue(event.target.value) // UI state
}}

```
Do not register input again. This custom hook is designed to take care of the registration process.
```javascript
const { field } = useController({ name: 'test' })

&lt;input {...field} /&gt; // ✅
&lt;input {...field} {...register('test')} /&gt; // ❌ double up the registration

```
It's ideal to use a single useController per component. If you need to use more than one, make sure you rename the prop. May want to consider using Controller instead.
```javascript
const { field: input } = useController({ name: 'test' })
const { field: checkbox } = useController({ name: 'test1' })

&lt;input {...input} /&gt;
&lt;input {...checkbox} /&gt;

```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/usecontroller/controller/

# Controller
Wrapper component for controlled inputs
#### Menu
## Controller: Component
React Hook Form embraces uncontrolled components and native inputs, however it's hard to avoid working with external controlled component such as React-Select, AntD and MUI. This wrapper component will make it easier for you to work with them.
## Props
The following table contains information about the arguments for Controller.
This is a render prop. A function that returns a React element and provides the ability to attach events and value into the component. This simplifies integrating with external controlled components with non-standard prop names. Provides onChange, onBlur, name, ref and value to the child component, and also a fieldState object which contains specific input state.
```javascript
&lt;Controller
  control={control}
  name="test"
  render={({
    field: { onChange, onBlur, value, name, ref },
    fieldState: { invalid, isTouched, isDirty, error },
    formState,
  }) =&gt; (
    &lt;Checkbox
      onBlur={onBlur} // notify when input is touched
      onChange={onChange} // send value to hook form
      checked={value}
      inputRef={ref}
    /&gt;
  )}
/&gt;
```
```javascript
&lt;Controller
  render={({
    field: { onChange, onBlur, value, name, ref },
    fieldState: { invalid, isTouched, isDirty, error },
  }) =&gt; (
    &lt;TextField
      value={value}
      onChange={onChange} // send value to hook form
      onBlur={onBlur} // notify when input is touched
      inputRef={ref} // wire up the input ref
    /&gt;
  )}
  name="TextField"
  control={control}
  rules={{ required: true }}
/&gt;
```
Important: Can not apply undefined to defaultValue or defaultValues at useForm.
You need to either set defaultValue at the field-level or useForm's defaultValues. undefined is not a valid value.
If your form will invoke reset with default values, you will need to provide useForm with defaultValues.
Calling onChange with undefined is not valid. You should use null or the empty string as your default/cleared value instead.
Validation rules in the same format for register options, which includes:
required, min, max, minLength, maxLength, pattern, validate
```javascript
rules={{ required: true }}
```
Input will be unregistered after unmount and defaultValues will be removed as well.
Note: this prop should be avoided when using with useFieldArray as unregister function gets called after input unmount/remount and reorder.
## Return
The following table contains information about properties which Controller produces.
A function which sends the input's value to the library.
This prop update formState and you should avoid manually invoke setValue or other API related to field update.
A function which sends the input's onBlur event to the library. It should be assigned to the input's onBlur prop.
The current value of the controlled component.
Input's name being registered.
A ref used to connect hook form to the input. Assign ref to component's input ref to allow hook form to focus the error input.
Invalid state for current input.
Touched state for current controlled input.
Dirty state for current controlled input.
error for this specific input.
Set to true after the user modifies any of the inputs.
Important: Make sure to provide all inputs' defaultValues at the useForm, so hook form can have a single source of truth to compare whether the form is dirty.
```javascript
const {
  formState: { isDirty, dirtyFields },
  setValue,
} = useForm({ defaultValues: { test: "" } });

// isDirty: true
setValue('test', 'change')
 
// isDirty: false because there getValues() === defaultValues
setValue('test', '') 

```
File typed input will need to be managed at the app level due to the ability to cancel file selection and FileList object.
An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues.
Important: Make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness.
Dirty fields will not represent as isDirty formState, because dirty fields are marked field dirty at field level rather the entire form. If you want to determine the entire form state use isDirty instead.
The value which has been set at useForm's defaultValues or updated defaultValues via reset API.
Indicate the form was successfully submitted without any runtime error.
true if the form is currently loading async default values.
Important: this prop is only applicable to async defaultValues
```javascript
const { 
  formState: { isLoading } 
} = useForm({ 
  defaultValues: async () =&gt; await fetch('/api') 
});

```
setError has no effect on isValid formState, isValid will always derived via the entire form validation result.
## Examples
```javascript
import React from "react";
import ReactDatePicker from "react-datepicker";
import { TextField } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";

function App() {
  const { handleSubmit, control } = useForm();

  return (
    &lt;form onSubmit={handleSubmit(data =&gt; console.log(data))}&gt;
      &lt;Controller
        control={control}
        name="ReactDatepicker"
        render={({ field: { onChange, onBlur, value, ref } }) =&gt; (
          &lt;ReactDatePicker
            onChange={onChange}
            onBlur={onBlur}
            selected={value}
          /&gt;
        )}
      /&gt;
      
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}
import ReactDatePicker from "react-datepicker";
import { TextField } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";

type FormValues = {
  ReactDatepicker: string;
} 

function App() {
  const { handleSubmit, control } = useForm&lt;FormValues&gt;();

  return (
    &lt;form onSubmit={handleSubmit(data =&gt; console.log(data))}&gt;
      &lt;Controller
        control={control}
        name="ReactDatepicker"
        render={({ field: { onChange, onBlur, value, ref } }) =&gt; (
          &lt;ReactDatePicker
            onChange={onChange} // send value to hook form
            onBlur={onBlur} // notify when input is touched/blur
            selected={value}
          /&gt;
        )}
      /&gt;
      
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
```javascript
import { Text, View, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";

export default function App() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: ''
    }
  });
  const onSubmit = data =&gt; console.log(data);

  return (
    &lt;View&gt;
      &lt;Controller
        control={control}
        rules={{
         required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) =&gt; (
          &lt;TextInput
            placeholder="First name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          /&gt;
        )}
        name="firstName"
      /&gt;
      {errors.firstName &amp;&amp; &lt;Text&gt;This is required.&lt;/Text&gt;}

      &lt;Controller
        control={control}
        rules={{
         maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) =&gt; (
          &lt;TextInput
            placeholder="Last name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          /&gt;
        )}
        name="lastName"
      /&gt;

      &lt;Button title="Submit" onPress={handleSubmit(onSubmit)} /&gt;
    &lt;/View&gt;
  );
}

```
## Video
The following video showcases what's inside Controller and how its been built.
## Tips
It's important to be aware of each prop's responsibility when working with external controlled components, such as MUI, AntD, Chakra UI. Controller acts as a "spy" on your input by reporting and setting value.
onChange: send data back to hook form
onBlur: report input has been interacted (focus and blur)
value: set up input initial and updated value
ref: allow input to be focused with error
name: give input an unique name
The following codesandbox demonstrate the usages:
MUI and other components
Chakra UI components
Do not register input again. This component is made to take care of the registration process.
```javascript
&lt;Controller
  name="test"
  render={({ field }) =&gt; {
    // return &lt;input {...field} {...register('test')} /&gt;; ❌ double up the registration
    return &lt;input {...field} /&gt;; // ✅
  }}
/&gt;

```
Customise what value gets sent to hook form by transforming the value during onChange.
```javascript
&lt;Controller
  name="test"
  render={({ field }) =&gt; {
    // sending integer instead of string.
    return &lt;input {...field} onChange={(e) =&gt; field.onChange(parseInt(e.target.value))} /&gt;;
  }}
/&gt;

```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useformcontext/

# useFormContext
React Context API for hook form
#### Menu
## useFormContext: Function
This custom hook allows you to access the form context. useFormContext is intended to be used in deeply nested structures, where it would become inconvenient to pass the context as a prop.
## Return
This hook will return all the useForm return methods and props.
```javascript
const methods = useForm()
      
&lt;FormProvider {...methods} /&gt; // all the useForm return props
      
const methods = useFormContext() // retrieve those props
```
## Rules
You need to wrap your form with the FormProvider component for useFormContext to work properly.
## Examples
```javascript
import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

export default function App() {
  const methods = useForm();
  const onSubmit = data =&gt; console.log(data);

  return (
    &lt;FormProvider {...methods} &gt; // pass all methods into the context
      &lt;form onSubmit={methods.handleSubmit(onSubmit)}&gt;
        &lt;NestedInput /&gt;
        &lt;input type="submit" /&gt;
      &lt;/form&gt;
    &lt;/FormProvider&gt;
  );
}

function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods
  return &lt;input {...register("test")} /&gt;;
}

```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/formprovider/

# FormProvider
A component to provide React Context
#### Menu
This component will host context object and allow consuming component to subscribe to context and use useForm props and methods.
## Props
This following table applied to FormProvider, useFormContext accepts no argument.
## Rules
Avoid using nested FormProvider
## Examples
```javascript
import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

export default function App() {
  const methods = useForm();
  const onSubmit = data =&gt; console.log(data);

  return (
    &lt;FormProvider {...methods} &gt; // pass all methods into the context
      &lt;form onSubmit={methods.handleSubmit(onSubmit)}&gt;
        &lt;NestedInput /&gt;
        &lt;input type="submit" /&gt;
      &lt;/form&gt;
    &lt;/FormProvider&gt;
  );
}

function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods
  return &lt;input {...register("test")} /&gt;;
}

```



Page URL: https://www.react-hook-form.com/api/usewatch/

# useWatch
React Hook for subscribing to input changes
#### Menu
## useWatch: ({ control?: Control, name?: string, defaultValue?: unknown, disabled?: boolean }) => object
Behaves similarly to the watch API, however, this will isolate re-rendering at the custom hook level and potentially result in better performance for your application.
## Props
default value for useWatch to return before the initial render.
Note: the first render will always return defaultValue when it's supplied.
Option to disable the subscription.
This prop will enable an exact match for input name subscriptions.
## Return
## Rules
The initial return value from useWatch will always return what's inside of defaultValue or defaultValues from useForm.
The only difference between useWatch and watch is at the root (useForm) level or the custom hook level update.
useWatch's execution order matters, which means if you update a form value before the subscription is in place, then the value updated will be ignored.
```javascript
setValue('test', 'data');
useWatch({ name: 'test' }); // ❌ subscription is happened after value update, no update received

useWatch({ name: 'example' }); // ✅ input value update will be received and trigger re-render
setValue('example', 'data'); 

```
You can overcome the above issue with a simple custom hook as below:
```javascript
const useFormValues = () =&gt; {
  const { getValues } = useFormContext();

  return {
    ...useWatch(), // subscribe to form value updates
    ...getValues(), // always merge with latest form values
  }
}

```
useWatch's result is optimised for render phase instead of useEffect's deps, to detect value updates you may want to use an external custom hook for value comparison.
## Examples
```javascript
import React from "react";
import { useForm, useWatch } from "react-hook-form";

function Child({ control }) {
  const firstName = useWatch({
    control,
    name: "firstName",
  });

  return &lt;p&gt;Watch: {firstName}&lt;/p&gt;;
}

function App() {
  const { register, control } = useForm({
    firstName: "test"
  });
  
  return (
    &lt;form&gt;
      &lt;input {...register("firstName")} /&gt;
      &lt;Child control={control} /&gt;
    &lt;/form&gt;
  );
}
import React from "react";
import { useForm, useWatch } from "react-hook-form";

interface FormInputs {
  firstName: string;
  lastName: string;
}

function FirstNameWatched({ control }: { control: Control&lt;FormInputs&gt; }) {
  const firstName = useWatch({
    control,
    name: "firstName", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
    defaultValue: "default" // default value before the render
  });

  return &lt;p&gt;Watch: {firstName}&lt;/p&gt;; // only re-render at the custom hook level, when firstName changes
}

function App() {
  const { register, control, handleSubmit } = useForm&lt;FormInputs&gt;();

  const onSubmit = (data: FormInputs) =&gt; {
    console.log(data)
  };

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;label&gt;First Name:&lt;/label&gt;
      &lt;input {...register("firstName")} /&gt;
      &lt;input {...register("lastName")} /&gt;
      &lt;input type="submit" /&gt;

      &lt;FirstNameWatched control={control} /&gt;
    &lt;/form&gt;
  );
}
```
```javascript
import React from "react";
import { useWatch } from "react-hook-form";

function totalCal(results) {
  let totalValue = 0;

  for (const key in results) {
    for (const value in results[key]) {
      if (typeof results[key][value] === "string") {
        const output = parseInt(results[key][value], 10);
        totalValue = totalValue + (Number.isNaN(output) ? 0 : output);
      } else {
        totalValue = totalValue + totalCal(results[key][value], totalValue);
      }
    }
  }

  return totalValue;
}

export const Calc = ({ control, setValue }) =&gt; {
  const results = useWatch({ control, name: "test" });
  const output = totalCal(results);

  // isolated re-render to calc the result with Field Array
  console.log(results);

  setValue("total", output);

  return &lt;p&gt;{output}&lt;/p&gt;;
};


```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useformstate/

# useFormState
Subscribe to form state update
#### Menu
## useFormState: ({ control: Control }) => FormState
This custom hook allows you to subscribe to each form state, and isolate the re-render at the custom hook level. It has its scope in terms of form state subscription, so it would not affect other useFormState and useForm. Using this hook can reduce the re-render impact on large and complex form application.
## Props
The following table contains information about the arguments for useFormState.
Option to disable the subscription.
This prop will enable an exact match for input name subscriptions.
## Return
Set to true after the user modifies any of the inputs.
Important: Make sure to provide all inputs' defaultValues at the useForm, so hook form can have a single source of truth to compare whether the form is dirty.
```javascript
const {
  formState: { isDirty, dirtyFields },
  setValue,
} = useForm({ defaultValues: { test: "" } });

// isDirty: true
setValue('test', 'change')
 
// isDirty: false because there getValues() === defaultValues
setValue('test', '') 

```
File typed input will need to be managed at the app level due to the ability to cancel file selection and FileList object.
An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues.
Important: Make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness.
Dirty fields will not represent as isDirty formState, because dirty fields are marked field dirty at field level rather the entire form. If you want to determine the entire form state use isDirty instead.
The value which has been set at useForm's defaultValues or updated defaultValues via reset API.
Indicate the form was successfully submitted without any runtime error.
true if the form is currently loading async default values.
Important: this prop is only applicable to async defaultValues
```javascript
const { 
  formState: { isLoading } 
} = useForm({ 
  defaultValues: async () =&gt; await fetch('/api') 
});

```
setError has no effect on isValid formState, isValid will always derived via the entire form validation result.
## Rules
Returned formState is wrapped with Proxy to improve render performance and skip extra computation if specific state is not subscribed, so make sure you deconstruct or read it before render in order to enable the subscription.
```javascript
const { isDirty } = useFormState(); // ✅
const formState = useFormState(); // ❌ should deconstruct the formState      

```
## Examples
```javascript
import * as React from "react";
import { useForm, useFormState } from "react-hook-form";

export default function App() {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      firstName: "firstName"
    }
  });
  const { dirtyFields } = useFormState({
    control
  });
  const onSubmit = (data) =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("firstName")} placeholder="First Name" /&gt;
      {dirtyFields.firstName &amp;&amp; &lt;p&gt;Field is dirty.&lt;/p&gt;}
      
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/useformstate/errormessage/

# ErrorMessage
An error message component to handle errors
#### Menu
## ErrorMessage: Component
A simple component to render associated input's error message.
## Props
Note: you need to set criteriaMode to 'all' for using messages.
## Examples
```javascript
import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

export default function App() {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const onSubmit = data =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("singleErrorInput", { required: "This is required." })} /&gt;
      &lt;ErrorMessage errors={errors} name="singleErrorInput" /&gt;
      
      &lt;ErrorMessage
        errors={errors}
        name="singleErrorInput"
        render={({ message }) =&gt; &lt;p&gt;{message}&lt;/p&gt;}
      /&gt;
      
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}
import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

interface FormInputs {
  singleErrorInput: string
}

export default function App() {
  const { register, formState: { errors }, handleSubmit } = useForm&lt;FormInputs&gt;();
  const onSubmit = (data: FormInputs) =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register("singleErrorInput", { required: "This is required." })} /&gt;
      &lt;ErrorMessage errors={errors} name="singleErrorInput" /&gt;
      
      &lt;ErrorMessage
        errors={errors}
        name="singleErrorInput"
        render={({ message }) =&gt; &lt;p&gt;{message}&lt;/p&gt;}
      /&gt;
      
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

```
```javascript
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

export default function App() {
  const { register, formState: { errors }, handleSubmit } = useForm({
    criteriaMode "all"
  });
  const onSubmit = data =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input
        {...register("multipleErrorInput", {
          required: "This is required.",
          pattern: {
            value: /d+/,
            message: "This input is number only."
          },
          maxLength: {
            value: 10,
            message: "This input exceed maxLength."
          }
        })}
      /&gt;
      &lt;ErrorMessage
        errors={errors}
        name="multipleErrorInput"
        render={({ messages }) =&gt;
          messages &amp;&amp;
          Object.entries(messages).map(([type, message]) =&gt; (
            &lt;p key={type}&gt;{message}&lt;/p&gt;
          ))
        }
      /&gt;

      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

interface FormInputs {
  multipleErrorInput: string
}

export default function App() {
  const { register, formState: { errors }, handleSubmit } = useForm&lt;FormInputs&gt;({
    criteriaMode: "all"
  });
  const onSubmit = (data: FormInputs) =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input
        {...register("multipleErrorInput", {
          required: "This is required.",
          pattern: {
            value: /d+/,
            message: "This input is number only."
          },
          maxLength: {
            value: 10,
            message: "This input exceed maxLength."
          }
        })}
      /&gt;
      &lt;ErrorMessage
        errors={errors}
        name="multipleErrorInput"
        render={({ messages }) =&gt;
          messages &amp;&amp;
          Object.entries(messages).map(([type, message]) =&gt; (
            &lt;p key={type}&gt;{message}&lt;/p&gt;
          ))
        }
      /&gt;

      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}
```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel



Page URL: https://www.react-hook-form.com/api/usefieldarray/

# useFieldArray
React hooks for Field Array
#### Menu
## useFieldArray: UseFieldArrayProps
Custom hook for working with Field Arrays (dynamic form). The motivation is to provide better user experience and performance. You can watch this short video to visualize the performance enhancement.
## Props
Name of the field array. Note: Do not support dynamic name.
Whether Field Array will be unregistered after unmount.
Name of the attribute with autogenerated identifier to use as the key prop. This prop is no longer required and will be removed in the next major version.
The same validation rules API as for register, which includes:
required, minLength, maxLength, validate
```javascript
useFieldArray({
  rules: { minLength: 4 }
})

```
In case of validation error, the root property is appended to formState.errors?.fieldArray?.root of type FieldErrorImportant: This is only applicable to built-in validation only.
Important: This is only applicable to built-in validation only.
### Examples
```javascript
function FieldArray() {
  const { control, register } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "test", // unique name for your Field Array
  });

  return (
    {fields.map((field, index) =&gt; (
      &lt;input
        key={field.id} // important to include key with field's id
        {...register(`test.${index}.value`)} 
      /&gt;
    ))}
  );
}


```
## Return
Append input/inputs to the end of your fields and focus. The input value will be registered during this action.
Important: append data is required and not partial.
Prepend input/inputs to the start of your fields and focus. The input value will be registered during this action.
Important: prepend data is required and not partial.
Insert input/inputs at particular position and focus. 
Important: insert data is required and not partial.
Update input/inputs at a particular position, updated fields will get unmount and remount. If this is not desired behavior, please use setValue API instead.
Important: update data is required and not partial.
## Rules
useFieldArray automatically generates a unique identifier named id which is used for key prop. For more information why this is required: https://reactjs.org/docs/lists-and-keys.html#keys
The field.id (and not index) must be added as the component key to prevent re-renders breaking the fields:// ✅ correct:
{fields.map((field, index) => <input key={field.id} ... />)}

// ❌ incorrect:
{fields.map((field, index) => <input key={index} ... />)}

```javascript
// ✅ correct:
{fields.map((field, index) =&gt; &lt;input key={field.id} ... /&gt;)}

// ❌ incorrect:
{fields.map((field, index) =&gt; &lt;input key={index} ... /&gt;)}

```
It's recommend to not stack actions one after another.
```javascript

onClick={() =&gt; {
  append({ test: 'test' });
  remove(0);
}}
            
// ✅ Better solution: the remove action is happened after the second render
React.useEffect(() =&gt; {
  remove(0);
}, [remove])

onClick={() =&gt; {
  append({ test: 'test' });
}}
            
```
Each useFieldArray is unique and has its own state update, which means you should not have multiple useFieldArray with the same name.
Each input name needs to be unique, if you need to build checkbox or radio with the same name then use it with useController or Controller.
Does not support flat field array.
When you append, prepend, insert and update the field array, the obj can't be empty object  rather need to supply all your input's defaultValues.
```javascript
append(); ❌
append({}); ❌
append({ firstName: 'bill', lastName: 'luo' }); ✅
```
## TypeScript
when register input name, you will have to cast them as const
```javascript
&lt;input key={field.id} {...register(`test.${index}.test` as const)} /&gt;
```
we do not support circular reference. Refer to this this Github issue for more detail.
for nested field array, you will have to cast the field array by its name.
```javascript
const { fields } = useFieldArray({ name: `test.${index}.keyValue` as 'test.0.keyValue' });
```
## Examples
```javascript
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

function App() {
  const { register, control, handleSubmit, reset, trigger, setError } = useForm({
    // defaultValues: {}; you can populate the fields by this attribute 
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test"
  });
  
  return (
    &lt;form onSubmit={handleSubmit(data =&gt; console.log(data))}&gt;
      &lt;ul&gt;
        {fields.map((item, index) =&gt; (
          &lt;li key={item.id}&gt;
            &lt;input {...register(`test.${index}.firstName`)} /&gt;
            &lt;Controller
              render={({ field }) =&gt; &lt;input {...field} /&gt;}
              name={`test.${index}.lastName`}
              control={control}
            /&gt;
            &lt;button type="button" onClick={() =&gt; remove(index)}&gt;Delete&lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
      &lt;button
        type="button"
        onClick={() =&gt; append({ firstName: "bill", lastName: "luo" })}
      &gt;
        append
      &lt;/button&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

import * as React from "react";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";

type FormValues = {
  cart: {
    name: string;
    price: number;
    quantity: number;
  }[];
};

const Total = ({ control }: { control: Control&lt;FormValues&gt; }) =&gt; {
  const formValues = useWatch({
    name: "cart",
    control
  });
  const total = formValues.reduce(
    (acc, current) =&gt; acc + (current.price || 0) * (current.quantity || 0),
    0
  );
  return &lt;p&gt;Total Amount: {total}&lt;/p&gt;;
};

export default function App() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm&lt;FormValues&gt;({
    defaultValues: {
      cart: [{ name: "test", quantity: 1, price: 23 }]
    },
    mode: "onBlur"
  });
  const { fields, append, remove } = useFieldArray({
    name: "cart",
    control
  });
  const onSubmit = (data: FormValues) =&gt; console.log(data);

  return (
    &lt;div&gt;
      &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
        {fields.map((field, index) =&gt; {
          return (
            &lt;div key={field.id}&gt;
              &lt;section className={"section"} key={field.id}&gt;
                &lt;input
                  placeholder="name"
                  {...register(`cart.${index}.name` as const, {
                    required: true
                  })}
                  className={errors?.cart?.[index]?.name ? "error" : ""}
                /&gt;
                &lt;input
                  placeholder="quantity"
                  type="number"
                  {...register(`cart.${index}.quantity` as const, {
                    valueAsNumber: true,
                    required: true
                  })}
                  className={errors?.cart?.[index]?.quantity ? "error" : ""}
                /&gt;
                &lt;input
                  placeholder="value"
                  type="number"
                  {...register(`cart.${index}.price` as const, {
                    valueAsNumber: true,
                    required: true
                  })}
                  className={errors?.cart?.[index]?.price ? "error" : ""}
                /&gt;
                &lt;button type="button" onClick={() =&gt; remove(index)}&gt;
                  DELETE
                &lt;/button&gt;
              &lt;/section&gt;
            &lt;/div&gt;
          );
        })}

        &lt;Total control={control} /&gt;

        &lt;button
          type="button"
          onClick={() =&gt;
            append({
              name: "",
              quantity: 0,
              price: 0
            })
          }
        &gt;
          APPEND
        &lt;/button&gt;
        &lt;input type="submit" /&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  );
}

```
```javascript
import * as React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";

export default function App() {
  const { control, handleSubmit } = useForm();
  const { fields, append, update } = useFieldArray({
    control,
    name: 'array'
  });

  return (
    &lt;form onSubmit={handleSubmit((data) =&gt; console.log(data))}&gt;
      {fields.map((field, index) =&gt; (
        &lt;Edit
          key={field.id}
          control={control}
          update={update}
          index={index}
          value={field}
        /&gt;
      ))}

      &lt;button
        type="button"
        onClick={() =&gt; {
          append({ firstName: "" });
        }}
      &gt;
        append
      &lt;/button&gt;
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
}

const Display = ({ control, index }) =&gt; {
  const data = useWatch({
    control,
    name: `array.${index}`
  });
  return &lt;p&gt;{data?.firstName}&lt;/p&gt;;
};

const Edit = ({ update, index, value, control }) =&gt; {
  const { register, handleSubmit } = useForm({
    defaultValues: value
  });

  return (
    &lt;div&gt;
      &lt;Display control={control} index={index} /&gt;
      
      &lt;input
        placeholder="first name"
        {...register(`firstName`, { required: true })}
      /&gt;

      &lt;button
        type="button"
        onClick={handleSubmit((data) =&gt; update(index, data))}
      &gt;
        Submit
      &lt;/button&gt;
    &lt;/div&gt;
  );
};


```
```javascript
import React from 'react';
import { useForm, useWatch, useFieldArray, Control } from 'react-hook-form';

type FormValues = {
  data: { name: string }[];
};

const ConditionField = ({
  control,
  index,
  register,
}: {
  control: Control&lt;FormValues&gt;;
  index: number;
}) =&gt; {
  const output = useWatch({
    name: 'data',
    control,
    defaultValue: 'yay! I am watching you :)',
  });

  return (
    &lt;&gt;
      {output[index]?.name === "bill" &amp;&amp; (
        &lt;input {...register(`data[${index}].conditional`)} /&gt;
      )}
      &lt;input
        {...register(`data[${index}].easyConditional`)}
        style={{ display: output[index]?.name === "bill" ? "block" : "none" }}
      /&gt;
    &lt;/&gt;
  );
};

const UseFieldArrayUnregister: React.FC = () =&gt; {
  const { control, handleSubmit, register } = useForm&lt;FormValues&gt;({
    defaultValues: {
      data: [{ name: 'test' }, { name: 'test1' }, { name: 'test2' }],
    },
    mode: 'onSubmit',
    shouldUnregister: false,
  });
  const { fields } = useFieldArray({
    control,
    name: 'data',
  });
  const onSubmit = (data: FormValues) =&gt; console.log(data);

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      {fields.map((data, index) =&gt; (
        &lt;&gt;
          &lt;input {...register(`data[${index}].name`)} /&gt;
          &lt;ConditionField control={control} register={register} index={index} /&gt;
        &lt;/&gt;
      ))}
      &lt;input type="submit" /&gt;
    &lt;/form&gt;
  );
};

```
```javascript
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

const App = () =&gt; {
  const { register, control } = useForm&lt;{
    test: { value: string }[];
  }&gt;({
    defaultValues: {
      test: [{ value: '1' }, { value: '2' }],
    },
  });
  const { fields, prepend, append } = useFieldArray({
    name: 'test',
    control,
  });
  
  return (
    &lt;form&gt;
      {fields.map((field, i) =&gt; (
        &lt;input key={field.id} {...register(`test.${i}.value` as const)} /&gt;
      ))}
      &lt;button
        type="button"
        onClick={() =&gt; prepend({ value: '' }, { focusIndex: 1 })}
      &gt;
        prepend
      &lt;/button&gt;
      &lt;button
        type="button"
        onClick={() =&gt; append({ value: '' }, { focusName: 'test.0.value' })}
      &gt;
        append
      &lt;/button&gt;
    &lt;/form&gt;
  );
};

```
## Video
The following video explains the basic usage of useFieldArray.
## Tips
#### Custom Register
You can also register inputs at Controller without the actual input. This makes useFieldArray quick and flexible to use with complex data structure or the actual data is not stored inside an input.
```javascript
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";

const ConditionalInput = ({ control, index, field }) =&gt; {
  const value = useWatch({
    name: "test",
    control
  });

  return (
    &lt;Controller
      control={control}
      name={`test.${index}.firstName`}
      render={({ field }) =&gt;
        value?.[index]?.checkbox === "on" ? &lt;input {...field} /&gt; : null
      }
    /&gt;
  );
};

function App() {
  const { control, register } = useForm();
  const { fields, append, prepend } = useFieldArray({
    control,
    name: "test"
  });

  return (
    &lt;form&gt;
      {fields.map((field, index) =&gt; (
        &lt;ConditionalInput key={field.id} {...{ control, index, field }} /&gt;
      ))}
    &lt;/form&gt;
  );
}

```
#### Controlled Field Array
There will be cases where you want to control the entire field array, which means each onChange reflects on the fields object.
```javascript
import { useForm, useFieldArray } from "react-hook-form";

export default function App() {
  const { register, handleSubmit, control, watch } = useForm&lt;FormValues&gt;();
  const { fields, append } = useFieldArray({
    control,
    name: "fieldArray"
  });
  const watchFieldArray = watch("fieldArray");
  const controlledFields = fields.map((field, index) =&gt; {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  return (
    &lt;form&gt;
      {controlledFields.map((field, index) =&gt; {
        return &lt;input {...register(`fieldArray.${index}.name` as const)} /&gt;;
      })}
    &lt;/form&gt;
  );
}
```
# Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
A project by BEEKAI | Please support us by leaving a ★ @github | Feedback
Hosted and powered by ▲ Vercel

