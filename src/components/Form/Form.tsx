import { useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import AsyncSelect from "react-select/async";
import "./form.css";

interface ContinentData {
  [countryCode: string]: {
    country: string;
    region: string;
  };
}

export type FormData = {
  name: string;
  email: string;
  country: string;
};

interface FormProps {
  onSubmit: (data: FormData) => void;
}

const Form = ({ onSubmit }: FormProps) => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormData>({ mode: "all" });
  // Haven't found the type for this useref from React-select or react-hook-form
  const selectRef = useRef<any>(null);

  const submissionHandler: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
    
    if (selectRef.current) {
      selectRef.current.clearValue();
    }
    reset();
  };

  const selectOptions = async () => {
    try {
      const response = await fetch("http://localhost:5173/countries.json");
      const countries = await response.json();
      const continentData: ContinentData = countries.data;

      const allCountryNames: string[] = Object.values(continentData).map(
        (country) => country.country
      );

      const countryOptions = allCountryNames.map((countryName) => ({
        value: countryName,
        label: countryName,
      }));

      return countryOptions;
    } catch (error) {
      console.error("Error with loading options: ", error);
      return [];
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(submissionHandler)}>
      <h1>Contact form</h1>
      <div className="form__wrapper">
        <div className="form__field">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: true,
              minLength: {
                value: 3,
                message: "Name cannot be less than 3 characters",
              },
              maxLength: {
                value: 45,
                message: "Name cannot exceed 45 characters",
              },
            })}
            aria-invalid={errors.name ? "true" : "false"}
            defaultValue=""
          />
          {errors.name?.type === "required" && (
            <p className="notice">*Name is required.</p>
          )}
          {errors.name?.message && (
            <p role="alert" className="notice">
              *{errors.name.message}
            </p>
          )}
        </div>

        <div className="form__field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              maxLength: 50,
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "invalid email address",
              },
            })}
            aria-invalid={errors.email ? "true" : "false"}
            defaultValue=""
          />
          {errors.email?.message && (
            <p className="notice">{errors.email.message}</p>
          )}
        </div>

        <div className="form__select">
          <label htmlFor="country">Country</label>
          <Controller
            name="country"
            control={control}
            render={({ field: { onChange }}) => (
              <AsyncSelect
                ref={selectRef}
                cacheOptions
                loadOptions={selectOptions}
                onChange={(country) => onChange(country?.value)}
                defaultOptions
              />
            )}
          />
        </div>
      </div>

      <div className="form__submission">
        <button className="form__submit">Submit form</button>
      </div>
    </form>
  );
};

export default Form;
