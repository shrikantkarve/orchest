import React from "react";
import { MDCButtonReact, MDCSwitchReact } from "@orchest/lib-mdc";
import { useOrchest } from "@/lib/orchest";

/**
 * @typedef {import("@/types").IOrchestSession} IOrchestSession
 */

/**
 * @typedef {Object} SessionToggleButtonProps
 * @property {IOrchestSession['pipeline_uuid']} pipeline_uuid
 * @property {IOrchestSession['project_uuid']} project_uuid
 * @property {string} [className]
 * @property {boolean} [fetchOnInit]
 * @property {boolean} [switch]
 */

/**
 * @type {React.FC<SessionToggleButtonProps>}
 */
const SessionToggleButton = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const { dispatch, get } = useOrchest();

  const session = get.session(props);
  // console.log("session ======", session, props);

  const sharedProps = {
    disabled:
      isLoading ||
      !session?.status ||
      ["STOPPING", "LAUNCHING"].includes(session?.status),
    label:
      {
        STOPPING: "Session stopping…",
        STARTING: "Session starting…",
        RUNNING: "Stop session",
      }[session?.status] || "Start session",
  };

  const handleEvent = (e) => {
    e.preventDefault();
    dispatch({ type: "sessionToggle" });
  };

  React.useEffect(() => {
    console.log("running dispatch for ", props);
    dispatch({ type: "sessionFetch", payload: props });
    setIsLoading(false);
  }, [props.pipeline_uuid, props.project_uuid]);

  return props.switch ? (
    <MDCSwitchReact
      {...sharedProps}
      onChange={handleEvent}
      classNames={props.className}
      on={session?.status === "RUNNING"}
    />
  ) : (
    <MDCButtonReact
      {...sharedProps}
      onClick={handleEvent}
      classNames={[
        props.className,
        "mdc-button--outlined",
        "session-state-button",
        // @rick do we need these?
        {
          RUNNING: "active",
          LAUNCHING: "working",
          STOPPING: "working",
          STOPPED: "active",
        }[session?.status] || "",
      ]}
      icon={session?.status === "RUNNING" ? "stop" : "play_arrow"}
    />
  );
};

export default SessionToggleButton;
