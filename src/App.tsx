import { useState } from "react";
import AuthForm from "./components/AuthForm";
import type { User } from "./types/user";
import ProjectsList from "./components/ProjectsList";
import ProjectForm from "./components/ProjectForm";
import ProjectDetails from "./components/ProjectDetails";
import { useProjects } from "./hooks/useProjects";
import type { Project } from "./types/project";

function App() {
  const [user, setUser] = useState<User>();
  const [projectForm, setProjectForm] = useState(false);
  const [projectDetails, setProjectDetails] = useState<Project | null>(null);

  const { data: projects = [], isLoading, error } = useProjects(user);

  const onProjectFormClose = () => {
    setProjectForm(false);
  };

  const onProjectDetailsClose = () => {
    setProjectDetails(null);
  };

  return (
    <main className="container mx-auto flex flex-col gap-15">
      <h1 className="text-7xl mt-10">Veel Test Task</h1>

      {user ? (
        <div className="flex flex-col gap-10">
          {projectForm && (
            <ProjectForm onClose={onProjectFormClose} user={user} />
          )}

          {projectDetails && (
            <ProjectDetails
              project={projectDetails}
              onClose={onProjectDetailsClose}
              user={user}
            />
          )}

          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex gap-4">
              <h2 className="font-bold">{user.name}</h2>
              <h2 className="font-bold">{user.email}</h2>
            </div>
            <button
              className="border-2 border-black py-4 px-8 rounded-3xl cursor-pointer font-bold"
              onClick={() => setProjectForm(true)}
            >
              Create project
            </button>
          </div>

          {isLoading ? (
            <p>Loading projects...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error.message}</p>
          ) : (
            <ProjectsList
              projects={projects}
              setProjectDetails={setProjectDetails}
            />
          )}
        </div>
      ) : (
        <AuthForm setUser={setUser} />
      )}
    </main>
  );
}

export default App;
