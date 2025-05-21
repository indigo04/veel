import type { Project } from "../types/project";

type Props = {
  projects: Project[];
  setProjectDetails: React.Dispatch<React.SetStateAction<Project | null>>;
};

export default function ProjectsList({ projects, setProjectDetails }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <td className="border-2 border-black px-2 font-bold">Name</td>
          <td className="border-2 border-black px-2 font-bold max-w-30 overflow-hidden text-ellipsis whitespace-nowrap">Description</td>
          <td className="border-2 border-black px-2 font-bold">Action</td>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td className="border-2 border-black px-2">{project.title}</td>
            <td className="border-2 border-black px-2 max-w-30 overflow-hidden text-ellipsis whitespace-nowrap">
              {project.description}
            </td>
            <td className="border-2 border-black px-2 text-blue-400 cursor-pointer underline" onClick={() => setProjectDetails(project)}>View</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
