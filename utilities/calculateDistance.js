Number.prototype.toRad = function () {
  return (this * Math.PI) / 180;
};

export default (userLocation, friendLocation) => {
  let lat1 = userLocation.lat;
  let lat2 = friendLocation.lat;
  let lon1 = userLocation.lng;
  let lon2 = friendLocation.lng;

  var R = 6371; // km
  var x1 = lat2 - lat1;
  var dLat = x1.toRad();
  var x2 = lon2 - lon1;
  var dLon = x2.toRad();
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1.toRad()) *
      Math.cos(lat2.toRad()) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distanceBetween = R * c;

  return distanceBetween;
};
