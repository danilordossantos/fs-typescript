import type { CoursePart } from "./types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  )
}

interface HeaderProps {
  courseName: string,
}

interface PartProps {
  part: CoursePart;
}

interface ContentProps {
  courseParts: CoursePart[],
}

interface TotalProps {
  courseParts: CoursePart[],
}

const Header = (props: HeaderProps) => {
  return <h1>{props.courseName}</h1>;
}

const Part = (props: PartProps) => {
  switch (props.part.kind) {
    case "basic":
      return (
        <p>
          <strong>{props.part.name}</strong> {props.part.exerciseCount} <br /><em>{props.part.description}</em>
        </p>
      );
    case "group":
      return (
        <p>
          <strong>{props.part.name}</strong> {props.part.exerciseCount} <br />project exercises {props.part.groupProjectCount}
        </p>
      );
    case "background":
      return (
        <p>
          <strong>{props.part.name}</strong> {props.part.exerciseCount} <br /><em>{props.part.description}</em><br />submit to {props.part.backgroundMaterial}
        </p>
      );
    case "special":
      return (
        <p>
          <strong>{props.part.name}</strong> {props.part.exerciseCount} <br /><em>{props.part.description}</em> <br />required skills: {props.part.requirements.join(", ")}
        </p>
      );
    default:
      return assertNever(props.part)
  }
}

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map(part => (
        <Part key={part.name} part={part} />
      ))}
    </div>
  );
};

const Total = (props: TotalProps) => {
  const total = props.courseParts.reduce((sum, part) => sum + part.exerciseCount, 0)
  return <p>Total of exercises: {total}</p>;
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    }
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
