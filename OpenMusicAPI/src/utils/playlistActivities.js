const mapPlaylistActivityDBToModel = ({
  username,
  title,
  action,
  time,
}) => ({
  username,
  title,
  action,
  time,
});

module.exports = { mapPlaylistActivityDBToModel };
