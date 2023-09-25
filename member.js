function skillsMember() {
  var member = document.getElementById("member").value;
  var member = parseInt(member);
  var member = member + 1;
  var member = member - 1;
  var member = member.toString();
  var member = member + " Members";
  document.getElementById("member").innerHTML = member;
}
