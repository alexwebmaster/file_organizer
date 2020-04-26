// Add the listener
document.addEventListener('DOMContentLoaded', function () {

  //Map input button
  document.getElementById("input_folder_select").addEventListener("change", function(event) {
    let files = event.target.files;

    if (files[0]) {
      create_file_list(files);
      let folder = get_folder(files[0]);
      let label = document.getElementById("input_folder_label");
      label.innerHTML = folder ;

      let parent_folder = get_parent_folder(files[0]);
      let output = document.getElementById("output_folder_label");
      if (output.value =='')  output.value = parent_folder+'output\\' ;
    }
    else 
    {
      alert('Empty Folder'); return  false;
    }
  }, false);

  //Map output button
  document.getElementById("output_folder_select").addEventListener("change", function(event) {
    let files = event.target.files;

    if (files[0]) {
      let folder = get_folder(files[0]);
      let label = document.getElementById("output_folder_label");
      label.value = folder;
    }
    else 
    {
      let label = document.getElementById("input_folder_label");
      let output = document.getElementById("output_folder_label");
      output.value = label.innerHTML+'output\\'  ;
      alert('Empty Folder, due limitations, please type the path or select another folder.'); return  false;
    }
  }, false);



})


function get_parent_folder(file)
{
  return file.path.replace(file.webkitRelativePath.replace('/', '\\'), '');  
}

function get_folder(file)
{
  let folder = file.webkitRelativePath.split('/');
  return file.path.replace(folder[1], '');  
}

function create_file_list(files)
{
  let output = document.getElementById("input_listing");
  let list = document.createElement("tbody");
  for (let i=0; i<files.length; i++) {
      let linha = document.createElement("tr");

      let path = document.createElement("td");
      path.innerHTML = files[i].webkitRelativePath;
      linha.appendChild(path);

      let size = document.createElement("td");
      size.innerHTML = (files[i].size/ 1024/1024).toFixed(2)+' MB';
      linha.appendChild(size);

      let status = document.createElement("td");
      linha.appendChild(status);

      list.appendChild(linha);
  };
  output.appendChild(list);
}