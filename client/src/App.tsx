import { Suspense, useState } from "react";
import Form from "./components/Form";
import Scene from "./components/Scene";

const App = () => {
  const [url, setUrl] = useState<string | null>(null);
  return (
    <div className="bg-slate-200 h-full px-4 py-4">
      <Form setUrl={setUrl} />
      <Suspense>
        {url && <Scene url={url} />}
      </Suspense>
    </div>
  );
};

export default App;