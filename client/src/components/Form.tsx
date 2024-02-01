import { useForm, SubmitHandler } from "react-hook-form";

type FormInputs = {
  model: FileList;
  name: string;
};

const Form = ({setUrl}: {setUrl: (url: string) => void}) => {
  const {
    register,
    handleSubmit,
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log('name:', data.name);
    console.log('model:', data.model[0]);
    const path = URL.createObjectURL(data.model[0]);
    setUrl(path);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} >
        <input 
          {...register('model')}
          type="file" 
          name="model" 
          id="model" 
        />
        <input
          {...register('name')}
          type="text"
          name="name"
          id="name"
        />
        <input type="submit" />
      </form>
    </div>
  );
}

export default Form;