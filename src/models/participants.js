module.exports = () => {
  const modelParticipants = (item) => {
    const participants = {
      status: item.status,
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      phone: item.phone,
      birthdate: item.birthdate,
      shoe_number: item.shoe_number,
      company: item.company,
      companion: item.companion,
      document_type: item.document_type,
      doc_number: item.doc_number,
      special_needs: item.special_needs,
      special_needs_describe: item.special_needs_describe,
      arrival_date: item.arrival_date,
      arrival_time: item.arrival_time,
      departure_date: item.departure_date,
      departure_time: item.arrival_time,
      flight_number: item.flight_number,
      have_allergy: item.have_allergy,
      allergy: item.allergy,
      password: item.password,
      registration_fee: item.registration_fee,
      letter: item.letter,
    };
    return participants;
  };

  return {
    modelParticipants,
  };
};
