import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  let ADMIN_SECRET = "admin123";

  public type Order = {
    orderId : Text;
    senderName : Text;
    senderAddress : Text;
    senderCity : Text;
    senderState : Text;
    senderZip : Text;
    senderPhone : Text;
    senderEmail : Text;
    receiverName : Text;
    receiverAddress : Text;
    receiverCity : Text;
    receiverState : Text;
    receiverZip : Text;
    receiverPhone : Text;
    receiverEmail : Text;
    weight : Text;
    length : Text;
    width : Text;
    height : Text;
    packageType : Text;
    description : Text;
    serviceType : Text;
    insurance : Bool;
    status : Text;
    createdAt : Text;
    estimatedDelivery : Text;
    price : Float;
    paymentConfirmed : Bool;
    deliveryLocation : Text;
  };

  public type Notification = {
    id : Nat;
    orderId : Text;
    message : Text;
    timestamp : Text;
    oldStatus : Text;
    newStatus : Text;
  };

  public type ServiceRequest = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    subject : Text;
    message : Text;
    timestamp : Text;
  };

  public type User = {
    name : Text;
    email : Text;
    phone : Text;
    registeredAt : Text;
  };

  let orders = Map.empty<Text, Order>();
  let notifications = Map.empty<Nat, Notification>();
  let serviceRequests = Map.empty<Nat, ServiceRequest>();
  let users = Map.empty<Text, User>();

  var nextNotifId : Nat = 1;
  var nextSrId : Nat = 1;

  // Public: create order
  public shared func createOrder(
    orderId : Text,
    senderName : Text,
    senderAddress : Text,
    senderCity : Text,
    senderState : Text,
    senderZip : Text,
    senderPhone : Text,
    senderEmail : Text,
    receiverName : Text,
    receiverAddress : Text,
    receiverCity : Text,
    receiverState : Text,
    receiverZip : Text,
    receiverPhone : Text,
    receiverEmail : Text,
    weight : Text,
    length : Text,
    width : Text,
    height : Text,
    packageType : Text,
    description : Text,
    serviceType : Text,
    insurance : Bool,
    createdAt : Text,
    estimatedDelivery : Text,
    price : Float
  ) : async Text {
    let order : Order = {
      orderId;
      senderName;
      senderAddress;
      senderCity;
      senderState;
      senderZip;
      senderPhone;
      senderEmail;
      receiverName;
      receiverAddress;
      receiverCity;
      receiverState;
      receiverZip;
      receiverPhone;
      receiverEmail;
      weight;
      length;
      width;
      height;
      packageType;
      description;
      serviceType;
      insurance;
      status = "Processing";
      createdAt;
      estimatedDelivery;
      price;
      paymentConfirmed = false;
      deliveryLocation = "";
    };
    orders.add(orderId, order);
    // Register user
    if (not users.containsKey(senderEmail)) {
      users.add(senderEmail, {
        name = senderName;
        email = senderEmail;
        phone = senderPhone;
        registeredAt = createdAt;
      });
    };
    orderId;
  };

  // Public: get order by ID
  public query func getOrder(orderId : Text) : async ?Order {
    orders.get(orderId);
  };

  // Public: submit service request
  public shared func submitServiceRequest(
    name : Text,
    email : Text,
    phone : Text,
    subject : Text,
    message : Text,
    timestamp : Text
  ) : async () {
    let sr : ServiceRequest = {
      id = nextSrId;
      name;
      email;
      phone;
      subject;
      message;
      timestamp;
    };
    serviceRequests.add(nextSrId, sr);
    nextSrId += 1;
  };

  // Admin: get all orders
  public query func getAllOrders(adminSecret : Text) : async [Order] {
    if (adminSecret != ADMIN_SECRET) { Runtime.trap("Unauthorized") };
    orders.values().toArray();
  };

  // Admin: update order status
  public shared func updateOrderStatus(adminSecret : Text, orderId : Text, newStatus : Text, timestamp : Text) : async () {
    if (adminSecret != ADMIN_SECRET) { Runtime.trap("Unauthorized") };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let oldStatus = order.status;
        orders.add(orderId, { order with status = newStatus });
        notifications.add(nextNotifId, {
          id = nextNotifId;
          orderId;
          message = "Order " # orderId # " status changed from " # oldStatus # " to " # newStatus;
          timestamp;
          oldStatus;
          newStatus;
        });
        nextNotifId += 1;
      };
    };
  };

  // Admin: confirm payment
  public shared func confirmPayment(adminSecret : Text, orderId : Text, timestamp : Text) : async () {
    if (adminSecret != ADMIN_SECRET) { Runtime.trap("Unauthorized") };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        orders.add(orderId, { order with paymentConfirmed = true });
        notifications.add(nextNotifId, {
          id = nextNotifId;
          orderId;
          message = "Payment confirmed for order " # orderId;
          timestamp;
          oldStatus = "Pending";
          newStatus = "Confirmed";
        });
        nextNotifId += 1;
      };
    };
  };

  // Admin: update order details
  public shared func updateOrderDetails(
    adminSecret : Text,
    orderId : Text,
    deliveryLocation : Text,
    receiverAddress : Text,
    receiverCity : Text,
    receiverState : Text,
    receiverZip : Text
  ) : async () {
    if (adminSecret != ADMIN_SECRET) { Runtime.trap("Unauthorized") };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        orders.add(orderId, {
          order with
          deliveryLocation;
          receiverAddress;
          receiverCity;
          receiverState;
          receiverZip;
        });
      };
    };
  };

  // Admin: get all notifications
  public query func getAllNotifications(adminSecret : Text) : async [Notification] {
    if (adminSecret != ADMIN_SECRET) { Runtime.trap("Unauthorized") };
    notifications.values().toArray();
  };

  // Admin: get all service requests
  public query func getAllServiceRequests(adminSecret : Text) : async [ServiceRequest] {
    if (adminSecret != ADMIN_SECRET) { Runtime.trap("Unauthorized") };
    serviceRequests.values().toArray();
  };

  // Admin: get all users
  public query func getAllUsers(adminSecret : Text) : async [User] {
    if (adminSecret != ADMIN_SECRET) { Runtime.trap("Unauthorized") };
    users.values().toArray();
  };
};
