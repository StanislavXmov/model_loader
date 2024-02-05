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
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
        <input 
          {...register('model', {required: true})}
          type="file" 
          name="model" 
          id="model"
          className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
        <input
          {...register('name', {required: true})}
          type="text"
          name="name"
          id="name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        {!model && (
          <button 
            type="submit"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            Load model
          </button>
        )}
        {model && !preview && (
          <button 
            onClick={setPreview} 
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            Set preview
          </button>
        )}
        {model && preview && (
          <button 
            onClick={submitModel} 
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            Submit model
          </button>
        )}
      </form>
    </div>
  );
}

export default Form;