import Command from "eris-boreas/lib/src/conversation/Command";
import Conversation from "eris-boreas/lib/src/conversation/Conversation";
import Longhorn from "../lib/longhorn";

export default class Fix implements Command {
  public aliases = ["fix"];
  public description = "Fixes a kubernetes namespace";
  public usage = "fix <namespace>";

  public async run(conversation: Conversation, args: string[]) {
    if (args.length === 1) {
      throw new Error("You must specify a namespace");
    }
    const namespace = args[1];
    const deploymentName = args[2];
    const longhorn = new Longhorn();
    if (deploymentName) {
      const deployment = await longhorn.k8sAppsApi.readNamespacedDeployment(
        deploymentName,
        namespace
      );
      await longhorn.fixDeployment(deployment.body);
    } else {
      await longhorn.fixVolumesInNamespace(namespace);
    }
    return "It should be fixed now";
  }
}
