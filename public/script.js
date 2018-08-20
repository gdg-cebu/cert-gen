var genCertUrl = 'https://us-central1-gdg-cebu-cert-gen.cloudfunctions.net/generateCert?id=';

  function setCertImage(imageUrl) {
    var removeLoading = false;
    if (!imageUrl) {
      imageUrl = '/loading.gif'
      document.querySelector('#cert').classList.add('loading');
    } else {
      removeLoading = true;
    }
    document.querySelector('#cert').setAttribute('src', imageUrl);
    document.querySelector('#cert').classList.remove('hidden');
    if (removeLoading) {
      document.querySelector('#cert').classList.remove('loading');
    }
  }

  function hideImage() {
    document.querySelector('#cert').classList.add('hidden');
  }

  document.addEventListener('DOMContentLoaded', function() {
    var db = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    db.settings(settings);
    document.querySelector('form').addEventListener('submit', function(e) {
      e.preventDefault();
      setCertImage();
      var emailAd = document.querySelector('#email').value;
      db.collection('participants-io').
        where('email', '==', emailAd).get().then(snapshot => {
          var errorContainer = document.querySelector('#error');
          if (snapshot.docs.length === 0) {
            errorContainer.classList.remove('hidden');
            setCertImage();
            hideImage();
            return;
          }
          errorContainer.classList.add('hidden');
          var data = snapshot.docs[0].data();
          var id = snapshot.docs[0].id;
          if (data.imageUrl) {
            document.querySelector('#form').classList.remove('form-center');
            setCertImage(data.imageUrl);
          } else {
            let url = genCertUrl + id;
            var req = new Request(url);
            fetch(req).then(resp => {
              resp.text().then((text) => {
                document.querySelector('#form').classList.remove('form-center');
                setCertImage(text);
              });
            });
          }
        });
    });
  });