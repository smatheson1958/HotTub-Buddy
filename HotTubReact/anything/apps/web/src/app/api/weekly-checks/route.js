import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const rows = await sql`
      SELECT * FROM weekly_checks 
      ORDER BY log_date DESC, created_at DESC
    `;
    return Response.json(rows);
  } catch (error) {
    console.error("Error fetching weekly checks:", error);
    return Response.json(
      { error: "Failed to fetch weekly checks" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      log_date,
      log_time,
      combined_chlorine,
      total_chlorine,
      total_alkalinity,
      copper,
      shock_added,
      shock_type,
      alkalinity_up_added,
      filter_cleaned,
      notes,
    } = body;

    const [newRecord] = await sql`
      INSERT INTO weekly_checks (
        log_date,
        log_time,
        combined_chlorine,
        total_chlorine,
        total_alkalinity,
        copper,
        shock_added,
        shock_type,
        alkalinity_up_added,
        filter_cleaned,
        notes
      ) VALUES (
        ${log_date},
        ${log_time || null},
        ${combined_chlorine || null},
        ${total_chlorine || null},
        ${total_alkalinity},
        ${copper || null},
        ${shock_added},
        ${shock_type || null},
        ${alkalinity_up_added || 0},
        ${filter_cleaned},
        ${notes}
      )
      RETURNING *
    `;

    return Response.json(newRecord);
  } catch (error) {
    console.error("Error creating weekly check:", error);
    return Response.json(
      { error: "Failed to create weekly check" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      id,
      log_date,
      log_time,
      combined_chlorine,
      total_chlorine,
      total_alkalinity,
      copper,
      shock_added,
      shock_type,
      alkalinity_up_added,
      filter_cleaned,
      notes,
    } = body;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const [updatedRecord] = await sql`
      UPDATE weekly_checks 
      SET 
        log_date = ${log_date},
        log_time = ${log_time || null},
        combined_chlorine = ${combined_chlorine || null},
        total_chlorine = ${total_chlorine || null},
        total_alkalinity = ${total_alkalinity},
        copper = ${copper || null},
        shock_added = ${shock_added},
        shock_type = ${shock_type || null},
        alkalinity_up_added = ${alkalinity_up_added || 0},
        filter_cleaned = ${filter_cleaned},
        notes = ${notes}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updatedRecord) {
      return Response.json({ error: "Record not found" }, { status: 404 });
    }

    return Response.json(updatedRecord);
  } catch (error) {
    console.error("Error updating weekly check:", error);
    return Response.json(
      { error: "Failed to update weekly check" },
      { status: 500 },
    );
  }
}
