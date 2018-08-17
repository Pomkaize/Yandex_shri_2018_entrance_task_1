export function hasInactiveStation(clusterData)
{
    return clusterData.some((object)=>!object.isActive);
}