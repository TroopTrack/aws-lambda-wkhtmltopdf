
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

module.exports = {
  bucket: 'some-bucket-name',
  settings: {
    pageSize: "Letter"
  }
};
