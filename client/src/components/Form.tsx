import { useForm, SubmitHandler } from "react-hook-form";
import { useModelStore } from "../store/useModelStore";

type FormInputs = {
  model: FileList;
  name: string;
};

const Form = ({setUrl}: {setUrl: (url: string) => void}) => {
  const {
    register,
    handleSubmit,
  } = useForm<FormInputs>();

  const model = useModelStore(s => s.model);
  const preview = useModelStore(s => s.preview);
  const name = useModelStore(s => s.name);
  // console.log({name, model, preview});
  const setModel = useModelStore(s => s.setModel);
  const setName = useModelStore(s => s.setName);
  const setIsPreview = useModelStore(s => s.setIsPreview);

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log('name:', data.name);
    console.log('model:', data.model[0]);

    setModel(data.model[0]);
    setName(data.name);
    const path = URL.createObjectURL(data.model[0]);
    setUrl(path);
  }

  const setPreview = () => {
    setIsPreview(true);
  }

  const submitModel = async () => {
    if (model && name && preview) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('model', model);
      formData.append('preview', preview);
      
      const res = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
      console.log(res);
      
    }
    
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
          {...register('name', {required: true})}
          type="text"
          name="name"
          id="name"
        />
        {!model && <button type="submit">Load model</button>}
        {model && !preview && <button onClick={setPreview} type="button">Set preview</button>}
        {model && preview && <button onClick={submitModel} type="button">Submit model</button>}
      </form>
    </div>
  );
}

export default Form;